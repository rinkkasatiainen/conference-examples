# Conference Examples - a set of code exercises for practice/training use.

This has a set of practices to learn basic concepts of technical agile, and beyond. The exercises here can be 
done in any of the languages present, or if your language is missing - let AI to generate the example for you. 

I will always improve and work on examples in the following language order: JS -> TS -> ??

The examples here contains (most likely in this order)

- [**Setup your test environment**](./setup-your-test-env/README.md): This is important to be done before the first session.
  - **Learning goal**: You have a working environment in the language of your choice (in this repo). Means you have a way to run
  unit tests, and making them green. Optionally, implement FizzBuzz kata for reminding your fingers of your favorite IDE shortcuts.
- [**How to test anything**](./how-to-test-anything/README.md): This is an empty repository with steps for evolving the code. 
  - **Learning goal**: Learn a model with which you know how to test anything. This is the base for all the consecutive sessions
- [**Test like a unit test**](./test-like-unit-test): Learn to write higher-level tests (component tests) that read like unit tests
  - **Learning goal**: see how the pattern from earlier actually works in any level of testing. This is typically a homework
    with task of making a video of your findings. To see my thinking, you can watch [this conference talk from me](https://www.youtube.com/watch?v=L9sXk0t8Iro).
  - Example tests are in a branch called 'with-tests'
- [**Finding Seams**](./finding-seams): Turn hard-to-test code into easy-to-test code
  - **Learning goal**: Learn and understand what a seam is. Learn to introduce seams to make hard-to-test code into 
  easy-to-test code
  - **Learning goal**: Learn 2 tricks on introducing a seam. These works always. Remember: "extract something somewhere!"
- [**Gradual Refactoring Safely**](./gradual-refactoring): Learn to take one slice at a time, and to push to prod safe changes, never breaking production
  - **Learning goal**: Learn 2 tricks on refactoring big messes safely, without breaking production. 
  - **Learning goal**: Learn to deploy better software in tiny chunks.
- [**Refactoring to Hexagonal**](./refactoring-to-hexagonal): Use the learnings above to take a production-code look-a-like and with simple
  and safe refactorings, make it testable, well factored and (as consequence) follow hexagonal architecture
  - **Learning goal**: Learn to trust on refactoring skills. 
  - **Learning goal**: Learn about hexagonal architecture
- [**Frontend Challenges**](./frontend): This is a place where we can learn WebComponents and using the learnings
  from backend development in frontend. (and never look back to React/Vue again, if we can choose to).
  - **Learning goal**: TBD