// Step 6 - Step 5 + <cfb-session-format> (form-associated custom element)

import { CfbTag }               from '../step-1/cfb-tag.js'
import { CfbSchedule }          from '../step-4/cfb-schedule.js'
import { CfbMenu }              from '../step-4/cfb-menu.js'
import { CfbBoardOrchestrator } from '../step-4/cfb-board-orchestrator.js'
import { CfbSessionLoader }     from '../step-4/cfb-session-loader.js'
import { CfbSessionStore }      from '../step-5/cfb-session-store.js'
import { CfbFlipCard }          from '../step-5/cfb-flip-card.js'
import { CfbSessionCard }       from '../step-5/cfb-session-card.js'
import { CfbSessionFormat }       from './cfb-session-format.js'
import { CfbAddSessionForm }    from './cfb-add-session-form.js'
import { CfbEditSessionForm }   from './cfb-edit-session-form.js'


customElements.define(CfbSessionFormat.elementName,      CfbSessionFormat)
customElements.define('cfb-tag',                       CfbTag)
customElements.define(CfbMenu.elementName,             CfbMenu)
customElements.define(CfbFlipCard.elementName,         CfbFlipCard)
customElements.define(CfbSessionCard.elementName,      CfbSessionCard)
customElements.define(CfbEditSessionForm.elementName, CfbEditSessionForm)
customElements.define('cfb-schedule',                  CfbSchedule)
customElements.define('cfb-board-orchestrator',        CfbBoardOrchestrator)
customElements.define('cfb-session-loader',            CfbSessionLoader)
customElements.define('cfb-session-store',             CfbSessionStore)
customElements.define(CfbAddSessionForm.elementName,   CfbAddSessionForm)
