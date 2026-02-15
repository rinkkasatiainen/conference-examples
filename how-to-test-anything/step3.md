# How to test anything

[..go back](./step2.md)

## Step 3 **Load Sessions Dynamically**

**Task**: Modify your `Scheduler` class to **load session options from an external source**:

1. Define an interface `ProvidesAvailableSlots` with a method:
    ```typescript
    interface ProvidesAvailableSlots {
      availableSlots(): Array<{ duration: number, max: number }>;
    }
    ```
    
2. Update your `Scheduler` to **accept a** `ProvidesAvailableSlots` **instance** and use it to get session durations 
instead of hardcoding them.
3. Test that your scheduler correctly uses sessions from the external source. 
    ```javascript
    class Scheduler {
      constructor(providesSlots) {
        this.sessions = providesSlots.availableSlots(); 
      }
    
      fill(totalTime) {
        // ...existing code
      }
    }
    ```

**Notes**

The goal is to **decouple session definitions** from the scheduler logic.

- You should be able to inject any class that matches the shape of `ProvidesAvailableSlots` and the scheduler still works.
- You can use stubs, fakes or make your own little object matching the Shape. You know, Duck Typing!
- `fill()` should behave exactly as before but now use the sessions provided dynamically.

**Acceptance Criteria:**

- The Scheduler is tested.
- The tests do not use a production class ProvidesAvailableSlots
    
**Example code**:
    
```typescript
    interface ProvidesSlots {
      availableSlots(): Array<{ duration: number, max: number }>;
    }
    
    interface Scheduler {
        fill( totalTime: number) : number[]
    }
    
    class AvailabilityScheduler implements Scheduler {
      constructor(providesSlots) {
        this.providesSlots = providesSlots;
      }
    
      fill(totalTime) {
        const result = [];
        let remaining = totalTime;
    
        for (const session of this.providesSlots.availableSlots()) {
          let used = 0;
          while (remaining >= session.duration && used < session.max) {
            result.push(session.duration);
            remaining -= session.duration;
            used++;
          }
        }
    
        return result;
      }
    }
```

**Questions**: 
- Q: Is new `AvailabilityProvider#fill` pure function? Why it would matter?
- A: By definition, a function is pure if it always returns the same output for the same input, and it has no side-effects.
Hence, If `ProvidesSlots#availableSlots` always returns the same value, and does not have side-effect, then `AvailabilityScheduler#fill`
is indeed a pure function

## Finished?

[Step 4](./step4.md)    