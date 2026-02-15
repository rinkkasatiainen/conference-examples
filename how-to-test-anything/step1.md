# How to test anything

[..go back](./README.md)

**Learning goal**: What is an incoming message - how to test an Incoming Query?

## Step 1 **Implement a scheduler algorithm**

**TASK**: Test-Drive an algorithm to give you list of available session durations from a set of available session slots.   

1. Implement a class 'AvailabilityScheduler' that has one method with signature:
   ``` typescript
    fill(availableTime: number): number[]
   ```
... where
  - **available time** (in minutes) is how many minutes still needs to be filled with sessions.

... and where you have
- Fixed **session durations** with **maximum allowed counts**

 | *Duration (in min)* | *Max Count* |
 |---------------------|-------------|
 | 90                  | 2           |
 | 60                  | 4           |
 | 30                  | 6           | 
 | 15                  | 6           |            

2. With these details, implement and test the method `fill`
3. If you choose to use _vanilla_ TDD, please go ahead - it's recommended

**Notes**

- Session durations may be reused only up to their maximum count
- The algorithm does not need to find an optimal solution
- Focus on correctness, readability, and clear logic

**Acceptance Criteria**

- Fill the total time using the available session durations as much as possible
- Prefer **longer sessions first** (greedy approach)
- Never exceed the maximum count for any session type
- Return an array of session durations whose sum is **≤ totalTime**
- Exact fill is preferred but **not guaranteed**.
- The function is tested.

**Examples**: 

- 90 -> [90]
- 180 -> [90, 90]
- 270 -> [90, 90, 60, 30]
- 105 -> [90, 15]
- 110 → [90, 15] (’losing 5 mins’)

**Solution** 1:

   ``` javascript
   class Scheduler {
     constructor() {
       this.sessions = [
         { duration: 90, max: 2 },
         { duration: 60, max: 4 },
         { duration: 30, max: 6 },
         { duration: 15, max: 6 }
       ];
     }
   
     fill(totalTime) {
       const result = [];
       let remaining = totalTime;
   
       for (const session of this.sessions) {
         let used = 0;
   
         while (
           remaining >= session.duration &&
           used < session.max
         ) {
           result.push(session.duration);
           remaining -= session.duration;
           used++;
         }
       }
   
       return result;
     }
   }
   ```


## Finished?

[Step 2](./step2.md)