# How to test anything

[..go back](./step2.md)

## Step 4 **Plan and Reserve Sessions**

**Task**: Implement a new class `SessionPlanner` that schedules and reserves sessions using the `Scheduler`. 

1. The class should have a method:
    ```typescript
    class SessionPlanner {
        planSession(sessionInfo: { title: string, duration: number }): void {
            // ... implement this
        }    
    }
    ```
    
2. `planSession` should
    - Call `scheduler.fill(totalTime)` to get available session slots.
    - Find a slot **long enough** for the given session (`slotDuration >= sessionInfo.duration`).
    - If a slot is found, call a collaborator to reserve it.
3. The **collaborator** is `ConferenceRoomManager` (or similar), which has a method:
    
    ```typescript
    interface ManagesRooms {
        assignSession(sessionInfo: { title: string, duration: number }, slotDuration: number): void
    }
    ```
    
4. If no slot is long enough, print or log a message that the session cannot be scheduled.
    - you can also throw an error, or return a failure of an ‘Either’ monad. Whatever suits you.
5. Test the new method.Example Usage

**Notes:**

 The goal is to **connect the scheduler with a “real world” reservation system**.• You can assume `Scheduler.fill()` already exists and works.

- Focus on using the slots returned by `fill()`
- Selecting an appropriate slot
- Calling the collaborator to reserve it

**Acceptance Criteria:**

- The SessionPlanner is tested.
- The tests do not use a production class ConferenceRoomManager

**Example Code**: 

   ```typescript
        // Collaborator: manages actual session assignment
        interface ManagesRooms {
          assignSession(sessionInfo: {title: string, duration: number}, slotDuration: number)
        }

        class ConferenceRoomManager implements ManagesRooms{
           assignSession(sessionInfo, slotDuration) {
              console.log(
                      `Assigned session "${sessionInfo.title}" (${sessionInfo.duration} min) into slot ${slotDuration} min`
              );
              // In a real system, this would reserve the slot
           }
        }

        interface IScheduler {
            // This is what we did already
        	fill( totalTime: number) : number[]
        }
        
        // New class: SessionPlanner
        class SessionPlanner {
          constructor(scheduler, roomManager, totalTime) {
            this.scheduler = scheduler;
            this.roomManager = roomManager;
            this.totalTime = totalTime;
          }
        
          planSession(sessionInfo) {
            // Get available slots
            const availableSlots = this.scheduler.fill(this.totalTime);
        
            // Find first slot long enough
            const slot = availableSlots.find(
              (duration) => duration >= sessionInfo.duration
            );
        
            if (slot) {
              // Reserve the session
              this.roomManager.assignSession(sessionInfo, slot);
            } else {
        	    const msg = `No available slot for session "${sessionInfo.title}" (${sessionInfo.duration} min)`
                console.log(msg)
                throw new Error(msg)
            }
          }
        }
   ```

## Finished?

🎉 Done! 🎉
