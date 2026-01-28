# How to test anything

[..go back](./step2.md)



## Step 5 **(Optional) I/O to the boundary**

**Task**: Modify the existing code

<div class="wrapper">
<span class="show-label">Show example Code:</span>
<input type="checkbox" id="nav-trigger" class="nav-trigger toggleCheckbox">
<label for="nav-trigger" class="toggleContainer">
    <div>&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
</label><div class="content">
       
   ```typescript
        // Collaborator: manages actual session assignment
        interface ManagesRooms {
          assignSession(sessionInfo: {title: string, duration: number}, slotDuration: number)
        }

        interface ProvidesAvailableSlots {
            availableSlots(): Array<{ duration: number, max: number }>;
        }

        interface Scheduler {
            // This is what we did already
        	fill( totalTime: number) : number[]
        }

        class SlotProviderAwareScheduler implements Scheduler {
            constructor(providesSlots) {
                this.sessions = this.providesSlots.availableSlots();
            }
        
            fill(totalTime) {
                const result = [];
                let remaining = totalTime;
        
                for (const session of this.sessions) {
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
        
        // New class: SessionPlanner
        class SessionPlanner {
          constructor(scheduler, roomManager, totalTime) {
            this.scheduler = scheduler;
            this.roomManager = roomManager;
            this.totalTime = totalTime;
          }
        
          planSession(sessionInfo) {
            // This hides part of the domain logic, together with I/O
            const availableSlots = this.scheduler.fill(this.totalTime);
        
            // This is also part of the domain logic
            const slot = this.domainLogic(availableSlots, sessionInfo)
        
            if (slot) {
              // I/O happens here, too
              this.roomManager.assignSession(sessionInfo, slot);
            } else {
        	    const msg = `No available slot for session "${sessionInfo.title}" (${sessionInfo.duration} min)`
                console.log(msg)
                throw new Error(msg)
            }
          }
            
          domainLogic(availableSlots, sessionInfo) {
              return availableSlots.find(
                  (duration) => duration >= sessionInfo.duration
              );
          }
        }
   ```
    
</div>
</div>

**Task**: Practice Functional Core / Imperative Shell.

Also known as 'I/O to the boundary' and 'Onion Architecture' and very close to 'Hexagonal Design'

The core of this is to make sure all the I/O happens at the boundaries, and all the domain logic
functions are pure functions. Figure out first where's the problematic part? What part of the 
domain logic is not actually pure (if we expect that available slots are retrieved from DB). 

1. Find out where the logic hides I/O that is not happening at the boundary (but in domain logic)
2. Move the I/O to boundary, expand Domain logic to accept all input data from the outside.
    ```javascript
    async function ioAtBoundary() {
        // read data - I/O at incoming boundary
        var inputData = await getInputData()
        // call pure function
        var result = pureDomainLogicLivesHere(inputData)
        // I/O happens at boundary too
        saveDataToDB(result)
    }
    ```
3. Write all the necessary tests.

**Notes**:

The problematic part is this:
```typescript
        class SlotProviderAwareScheduler implements Scheduler {
            constructor(providesSlots) {
                this.sessions = this.providesSlots.availableSlots();
            }
            // ... rest omitted
        }
```

because it reads data inside the domain functionality. Do provide another version of `fill` that takes
also the sessions as parameter. Write tests for that function,

Then write tests for the SessionPlanner (you know how to handle outgoing queries / commands).

**Acceptance Criteria**:

Code respects I/O to the boundary or 'functional core/imperative shell' approach

## Finished?

🎉 Done! 🎉

<style>
.nav-trigger {
    position: absolute;
    clip: rect(0, 0, 0, 0);
}

.nav-trigger:not(:checked) ~ .content {
    display: none;
}

.nav-trigger:checked ~ .content {
    display: -ms-flexbox;
    display: block;
}

.toggleCheckbox {
    display: none;
}

.toggleContainer {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: fit-content;
    border: 3px solid #343434;
    border-radius: 20px;
    background: #343434;
    font-weight: bold;
    color: #343434;
    cursor: pointer;
}

.toggleContainer::before {
    content: '';
    position: absolute;
    width: 50%;
    height: 100%;
    left: 50%;
    border-radius:20px;
    background: white;
    transition: all 0.3s;
}
.toggleContainer div {
    padding: 6px;
    text-align: center;
    z-index: 1;
}
.toggleCheckbox:checked + .toggleContainer::before {
    left: 0%;
}
.toggleCheckbox:checked + .toggleContainer div:first-child{
    color: white;
    transition: color 0.3s;
}
.toggleCheckbox:checked + .toggleContainer div:last-child{
    color: #343434;
    transition: color 0.3s;
}
.toggleCheckbox + .toggleContainer div:first-child{
    color: #343434;
    transition: color 0.3s;
}
.toggleCheckbox + .toggleContainer div:last-child{
    color: white;
    transition: color 0.3s;
}

</style>