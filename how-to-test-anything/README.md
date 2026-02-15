# How to test anything

**Learning goal**: A simple model that shows how to test anything.

**Background info**: This is designed to be used with objects and object-oriented code - but the learnings 
are similar in functional languages, too. Just some steps might be a bit _weird_. So if possible, use Classes and 
Objects on this exercise, if you choose to.

**Problem**: You are implementing a simple scheduler for a conference sessions. You are given as input the lenght of a
conference days in minutes, and you know which kind of session slots you have and how many.

The domain is meant to be easy - you can assume the following:
- you can only pass valid data, 
  - no negative numbers, 
  - no 0, no null, etc.
- when handling time, it's always in minutes.
  - no need to add a 'Timespan' object.

This time, we have a very specific learning goal and that is **not** about finding all the corner cases etc.

**Before we start**: Answer to the following questions?
- What is difference between a Query and a Command?
- Why does it matter? Why is it important to separate them?

Let's build a 2-by-3 matrix like this:

```
          \  Type +-------------+-------------+
              \   |    Query    |   Command   |
          Origin \+=============+=============+
                  |             |             |
     incoming     |             |             |
                  |             |             |
                  +-------------+-------------+
                  |             |             |
     sent to self |             |             |
                  |             |             |
                  +-------------+-------------+
                  |             |             |
     outgoing     |             |             |
                  |             |             |
                  +-------------+-------------+
```

The message has 2 types: 'Query' and 'Command', while message origin has 3 options: 
'incoming', 'sent to self' or 'outgoing'. We'll define these later.


<img src="./how-to-test-anything-visual.png" width="500" height="300" style="object-fit: contain;" />

## Ready to start?
[Step 1](./step1.md)
