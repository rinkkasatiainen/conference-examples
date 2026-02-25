
## example code for the step 4

```javascript
export class SessionScheduling {
  constructor(scheduler, managesConferenceSessions, totalTime) {
    this.#scheduler = scheduler
    this.#managesConferenceSessions = managesConferenceSessions
    this.#totalTime = totalTime
  }

  planSession(sessionInfo) {
    const availableSlots = this.#scheduler.fill(this.#totalTime)

    const slot = this.#findMatchingSlot(availableSlots, sessionInfo)

    if (slot) {
      this.#managesConferenceSessions.assignSession(sessionInfo, slot)
    } else {
      const msg = `No available slot for session "${sessionInfo.title}" (${sessionInfo.duration} min)`
      console.log(msg)
      throw new Error(msg)
    }
  }

  #findMatchingSlot(availableSlots, sessionInfo) {
    return availableSlots.sort((a, b) => a - b).find(
      duration => duration >= sessionInfo.duration,
    )
  }
}

```