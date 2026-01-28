# How to test anything

[..go back](./step1.md)

## Step 2 **Make the Scheduler Configurable**

**Task**: Make available slots modifiable 

1. Extend your `Scheduler` class by adding a method:
    ``` typescript
    setSessions(sessions: Array<{ duration: number, max: number }>): void
    ```
... where 
 - **sessions** is an array of new session slots.

2. This method should **replace the current session durations and max counts** with the ones provided.
3. Plan how you will test the `setSessions` method, and **test it**.

**Notes**

- You do **not** need to implement `fill()` again — just make sure it uses the new sessions.
- Focus on correctly storing the session array and maintaining the **duration/max count** information.
- Think the way(s) this can be tested! What of (any) would you choose and why?

**Acceptance Criteria:**

- The code is tested.

**Examples**

One possible way of using the new Scheduler in tests.

   ``` javascript
   // Initialize Scheduler
   const scheduler = new Scheduler();
   
   // Set custom sessions
   scheduler.setSessions([
     { duration: 45, max: 3 },
     { duration: 20, max: 5 },
     { duration: 10, max: 10 }
   ]);
   
   // Test the method.
   ```


## Finished?

[Step 3](./step3.md)
