# Finding seams, speaker-feedback.md

[..go back](./README.md)

## Step 1 **Test SpeakerFeedbackService#evaluateSpeaker**

**Background**: Speaker feedback system.

Your job is to cover `SpeakerFeedbackService#evaluateSpeaker` with tests, because you'll have a 
change requirement on this part of the code. There exists already an existing test that randomly fails.  Your job
is to **touch only `SpeakerFeedbackService`** and make that test never to fail.

**Task**: Make Feedback Service Test not failing randomly 

1. Run `1-speaker-feedback.test` for a few times. See it randomly fail (roughly 1/10 should fail.)
2. Identify what is the difficult part in making this fail.
3. How would you "extract something somewhere" to make the logic easier to test?

**Notes**

- On the first example, feel free to use constructor injection
- Think the way(s) this can be tested! What of (any) would you choose and why?

**Acceptance Criteria:**

- The code is tested.

**Conclusions**:
- What was it that made this function hard to test?
- Do you see similar issues in your production code?
- What did you learn? How could you try this in prod code?

## Finished?

[Step 3](./step3.md)


**Solution**

Spoiler alert! This will share the solution.

One way to solve this, is to use a 'peel' pattern from 'Peel and Slice' refactoring pattern. The peel, means that you
move the 'hard to test' parts


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


