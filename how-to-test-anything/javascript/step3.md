
## example code for the step 3

```javascript
export class ScheduleAwareAvailabilityScheduler {
  #providesSlots

  constructor(providesSlots) {
    this.#providesSlots = providesSlots
  }

  fill(totalTime) {
    const result = []
    let remaining = totalTime

    for (const session of this.#providesSlots.availableSlots()) {
      let used = 0
      while (remaining >= session.duration && used < session.max) {
        result.push(session.duration)
        remaining -= session.duration
        used++
      }
    }

    return result
  }
}
```