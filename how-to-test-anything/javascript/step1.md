
## example code for the step 1

```javascript
export class AvailabilityScheduler {
  constructor() {
    this.slots = this.#availableSlots()
  }

  fill(totalTime) {
    const result = []
    let remaining = totalTime

    for (const session of this.slots) {
      let used = 0
      while (remaining >= session.duration && used < session.max) {
        result.push(session.duration)
        remaining -= session.duration
        used++
      }
    }

    return result
  }

  #availableSlots = () => [
    { duration: 90, max: 2 },
    { duration: 60, max: 4 },
    { duration: 30, max: 6 },
    { duration: 15, max: 6 },
  ]
}
```