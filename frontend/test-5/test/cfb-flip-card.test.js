import * as chai from 'chai'
import { expect } from 'chai'
import { spy } from 'sinon'
import sinonChai from 'sinon-chai'
import { CfbFlipCard } from '../../step-5/cfb-flip-card.js'
import { cleanup, fixture } from './helpers/fixture.js'
import { useSinonChai } from './helpers/chai-helpers.js'

useSinonChai(chai, sinonChai)

customElements.define(CfbFlipCard.elementName, CfbFlipCard)

// Both slots are filled the way step-5 fills them - a session card in front, an
// edit form on the back - using the app's own class names, so the page's real
// stylesheet dresses them. In --manual mode you watch an actual card flip over.
const CARD_HTML = `
  <cfb-flip-card style="width: 260px">
    <article slot="front" class="cfb-card">
      <header class="cfb-card__header">
        <span class="cfb-card__title">
          <span class="cfb-card__title-text">Testing Web Components</span>
        </span>
      </header>
      <div class="cfb-card__tags">
        <span class="cfb-tag cfb-tag--blue">testing</span>
        <span class="cfb-tag cfb-tag--green">tdd</span>
      </div>
    </article>
    <form slot="back" class="cfb-edit-form">
      <header class="cfb-edit-form__header">
        <h3 class="cfb-edit-form__title">Edit Session</h3>
      </header>
      <div class="cfb-edit-form__body">
        <p>This is placeholder for the edit form</p>
      </div>
      <div class="cfb-edit-form__actions">
        <p>And the buttons, which do nothings</p>
        <button type="button" class="cfb-edit-form__cancel">Cancel</button>
        <button type="submit" class="cfb-edit-form__save">Save</button>
      </div>
    </form>
    
  </cfb-flip-card>
`

describe('<cfb-flip-card> - flipping', () => {
  afterEach(() => {
    cleanup()
    backdrops().forEach(el => el.remove())
  })

  describe('resting state', () => {
    it('renders a front and a back slot', async () => {
      const el = await card()

      expect(slotNamesOf(el)).to.eql(['front', 'back'])
    })

    it('is neither flipping nor flipped', async () => {
      const el = await card()

      expect(el.classList.contains('is-flipping')).to.be.false
      expect(el.classList.contains('is-flipped')).to.be.false
    })

    it('has no backdrop', async () => {
      await card()

      expect(backdrops()).to.have.lengthOf(0)
    })
  })

  // cfb-flip-card puts the backdrop and the placeholder in the *light* DOM on
  // purpose: styling them is the page's job (css/molecules/cfb-card-flip.css).
  // If this fails, the test page has lost the app's stylesheet - everything else
  // here would still pass, while --manual would show nothing worth looking at.
  // You can test this behavior by removing stylesheet in 'web-test-runner.config.mjs' and running the tests.
  describe('the page styles what the component leaves to it', () => {
    it('dresses the backdrop', async () => {
      const el = await card()

      el.flip()

      const backdrop = getComputedStyle(backdrops()[0])
      expect(backdrop.position).to.equal('fixed')
      expect(backdrop.zIndex).to.equal('199')
    })
  })

  describe('flip()', () => {
    it('pins the card at the position it had while in flow', async () => {
      const el = await card()
      expect(el.style.position).to.equal('') // by default position is empty
      const { top, left, width, height } = el.getBoundingClientRect()

      el.flip()

      // Read before the next frame: flip() pins first, then animates.
      expect(el.style.position).to.equal('fixed')
      expect(el.style.top).to.equal(`${top}px`)
      expect(el.style.left).to.equal(`${left}px`)
      expect(el.style.width).to.equal(`${width}px`)
      expect(el.style.height).to.equal(`${height}px`)
    })

    it('marks the card as flipping so the transitions apply', async () => {
      const el = await card()

      el.flip()

      expect(el.classList.contains('is-flipping')).to.be.true
    })

    it('rotates to the back face on the next frame', async () => {
      const el = await card()

      el.flip()
      expect(el.classList.contains('is-flipped'), 'flipped too early').to.be.false

      await nextFrame()
      expect(el.classList.contains('is-flipped')).to.be.true
    })

    it('grows towards the centre of the viewport', async () => {
      const el = await card()

      el.flip()
      await nextFrame()

      const expectedW = Math.min(400, window.innerWidth * 0.92)
      const expectedH = Math.min(560, window.innerHeight * 0.88)
      expect(el.style.width).to.equal(`${expectedW}px`)
      expect(el.style.height).to.equal(`${expectedH}px`)
      expect(el.style.left).to.equal(`${(window.innerWidth - expectedW) / 2}px`)
      expect(el.style.top).to.equal(`${Math.max(16, (window.innerHeight - expectedH) / 2)}px`)
    })

    it('adds a backdrop to the body and reveals it on the next frame', async () => {
      await card()

      cardOf().flip()
      expect(backdrops()).to.have.lengthOf(1)
      expect(backdrops()[0].parentElement).to.equal(document.body)
      expect(backdrops()[0].classList.contains('is-visible'), 'visible too early').to.be.false

      await nextFrame()
      expect(backdrops()[0].classList.contains('is-visible')).to.be.true
    })

    it('leaves a placeholder of the same size in the flow', async () => {
      const el = await card()
      const { offsetWidth, offsetHeight } = el

      el.flip()

      const placeholder = placeholderOf()
      expect(placeholder, 'no placeholder inserted').to.exist
      expect(placeholder.nextElementSibling).to.equal(el)
      expect(placeholder.style.width).to.equal(`${offsetWidth}px`)
      expect(placeholder.style.height).to.equal(`${offsetHeight}px`)
    })

    it('the placeholder shows a copy of the front face', async () => {
      const el = await card()

      el.flip()

      const front = el.querySelector('[slot="front"]')
      const copy = placeholderOf().firstElementChild
      expect(copy.toString()).to.eql(front.toString())
    })

    it('has no placeholder when there is no front face', async () => {
      const el = await card('<cfb-flip-card><p slot="back">Back</p></cfb-flip-card>')

      el.flip()

      expect(placeholderOf()).to.not.exist
    })
  })

  describe('unflip()', () => {
    it('rotates back to the front face', async () => {
      const el = await flipped()

      el.unflip()

      expect(el.classList.contains('is-flipped')).to.be.false
    })

    it('hides the backdrop', async () => {
      const el = await flipped()

      el.unflip()

      expect(backdrops()[0].classList.contains('is-visible')).to.be.false
    })

    it('shrinks back to the position it was flipped from', async () => {
      const el = await cardWithFrozenAnimation()
      const { top, left, width, height } = el.getBoundingClientRect()
      el.flip()
      await nextFrame()

      el.unflip()
      await nextFrame()

      expect(el.style.top).to.equal(`${top}px`)
      expect(el.style.left).to.equal(`${left}px`)
      expect(el.style.width).to.equal(`${width}px`)
      expect(el.style.height).to.equal(`${height}px`)
    })

    it('puts the card back into the flow once the rotation has finished', async () => {
      const el = await flipped()

      el.unflip()
      await fakeEndOfRotation(el)

      expect(el.classList.contains('is-flipping')).to.be.false
      expect(el.getAttribute('style')).to.be.oneOf([null, ''])
      expect(placeholderOf()).to.not.exist
      expect(backdrops()).to.have.lengthOf(0)
    })

    it('calls back once the rotation has finished', async () => {
      const el = await flipped()
      const callback = spy()

      el.unflip(callback)
      expect(callback, 'called before the animation finished').to.not.have.been.called

      await fakeEndOfRotation(el)
      expect(callback).to.have.been.calledOnce
    })

    it('stops listening for the rotation, so a later flip does not call back again', async () => {
      const el = await flipped()
      const callback = spy()

      el.unflip(callback)
      await fakeEndOfRotation(el)
      await fakeEndOfRotation(el)

      expect(callback).to.have.been.calledOnce
    })
  })

  describe('closing by clicking the backdrop', () => {
    it('unflips the card', async () => {
      const el = await flipped()

      backdrops()[0].click()

      expect(el.classList.contains('is-flipped')).to.be.false
    })

    it('cleans up once the rotation has finished', async () => {
      const el = await flipped()

      backdrops()[0].click()
      await fakeEndOfRotation(el)

      expect(backdrops()).to.have.lengthOf(0)
      expect(placeholderOf()).to.not.exist
    })
  })

  describe('when removed from the DOM while flipped', () => {
    it('takes its backdrop and placeholder with it', async () => {
      const el = await flipped()

      el.remove()

      expect(backdrops()).to.have.lengthOf(0)
      expect(placeholderOf()).to.not.exist
    })
  })

  // Every other test here freezes the animation to control the timing, which
  // means none of them prove the card actually animates. This one takes the
  // real 0.6s rotation each way, ending on the browser's own transitionend
  // rather than a dispatched one. It is the one to see live in --manual mode.
  describe('slow test', () => {
    it('flips and unflips at full speed, on the browser\'s own timing', async function () {
      this.timeout(6000)
      const el = await card()

      const startedFlip = performance.now()
      el.flip()
      await rotationOf(el)

      expect(el.classList.contains('is-flipped'), 'never reached the back face').to.be.true
      expect(performance.now() - startedFlip, 'rotated instantly - was it animated at all?')
        .to.be.greaterThan(300)

      await hold(400)  // linger on the back face, so there is something to see

      const startedUnflip = performance.now()
      el.unflip()
      await rotationOf(el)

      expect(el.classList.contains('is-flipping'), 'never came to rest').to.be.false
      expect(el.getAttribute('style')).to.be.oneOf([null, ''])
      expect(backdrops()).to.have.lengthOf(0)
      expect(placeholderOf()).to.not.exist
      expect(performance.now() - startedUnflip, 'rotated back instantly').to.be.greaterThan(300)
    })
  })
})

// ── Helpers ──────────────────────────────────────────────────────

function card(html = CARD_HTML) {
  return fixture(html)
}

// unflip() ends on the first transitionend from .inner, and the browser decides
// when that is - a rotation reversed after a frame or two gets a correspondingly
// short duration, which would race every assertion about the state *during* the
// animation. Tests that care about that ordering freeze the real transitions and
// let fakeEndOfRotation() say when the rotation is over. The rest keep the real ones,
// so --manual shows an actual flip.
async function cardWithFrozenAnimation(html = CARD_HTML) {
  const el = await card(html)
  el.shadowRoot.appendChild(Object.assign(document.createElement('style'), {
    textContent: `:host, .inner { transition: none !important }`,
  }))
  return el
}

async function flipped() {
  const el = await cardWithFrozenAnimation()
  el.flip()
  await nextFrame()
  return el
}

// flip()/unflip() stage their changes in a requestAnimationFrame callback.
function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

// Waits for the browser to finish rotating .inner for real - no dispatching.
// unflip() adds its listener before this one, so by the time this resolves the
// card has already done its own cleanup.
function rotationOf(el, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const inner = el.shadowRoot.querySelector('.inner')
    const giveUp = setTimeout(
      () => reject(new Error(`no transitionend from .inner within ${timeout}ms`)),
      timeout,
    )
    inner.addEventListener('transitionend', () => {
      clearTimeout(giveUp)
      resolve()
    }, { once: true })
  })
}

function hold(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Ends the rotation the card is waiting for. The frame up front lets unflip()'s
// own rAF - the one that shrinks the card back - run first, as it would in a
// browser where the rotation takes 0.6s.
async function fakeEndOfRotation(el) {
  await nextFrame()
  el.shadowRoot.querySelector('.inner')
    .dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'transform' }))
  await nextFrame()
}

function cardOf() {
  return document.querySelector(CfbFlipCard.elementName)
}

function backdrops() {
  return Array.from(document.querySelectorAll('.cfb-card-flip__backdrop'))
}

function placeholderOf() {
  return document.querySelector('.cfb-card-flip__placeholder')
}

function slotNamesOf(el) {
  return Array.from(el.shadowRoot.querySelectorAll('slot')).map(s => s.name)
}

function assignedTo(el, slotName) {
  return el.shadowRoot.querySelector(`slot[name="${slotName}"]`).assignedNodes({ flatten: true })
    .filter(n => n.nodeType === Node.ELEMENT_NODE)
}