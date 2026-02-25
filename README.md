# Conference Examples - a set of code exercises for practice/training use.

This has a set of practices to learn basic concepts of technical agile, and beyond. The exercises here can be 
done in any of the languages present, or if your language is missing - let AI to generate the example for you. 

I will always improve and work on examples in the following language order: JS -> TS -> ??

The examples here contains (most likely in this order)

**Pre training setup:**
- [**Setup your test environment**](00-setup-your-test-env/README.md): This is important to be done before the first session.
  - **Learning goal**: You have a working environment in the language of your choice (in this repo). Means you have a way to run
    unit tests, and making them green. Optionally, implement FizzBuzz kata for reminding your fingers of your favorite IDE shortcuts.
  - **Learning goal**: If running training online, use of 'mob.sh' tool for a quick switch of person in keyboard.

**The likely setup for a 2-day onsite course:**
- [**Basics of TDD**](./basics-of-TDD/README.md): The basic flow of TDD and pair/ensemble programming
  - **Learning goal**: Learn how to work together in pairs or small groups. Learn using tools that support rapid switching
    of the one who's typing.
- [**How to test anything**](how-to-test-anything/README.md): This is an empty repository with steps for evolving the code. 
  - **Learning goal**: Learn a model with which you know how to test anything. This is the base for all the consecutive sessions
- [**Test like a unit test**](./test-like-unit-test/README.md): Learn to write higher-level tests (component tests) that read like unit tests
  - **Learning goal**: see how the pattern from earlier actually works in any level of testing. This is typically a homework
    with task of making a video of your findings. To see my thinking, you can watch [this conference talk from me](https://www.youtube.com/watch?v=L9sXk0t8Iro).
  - Example tests are in a branch called 'with-tests'
- [**Finding Seams**](./finding-seams/README.md): Turn hard-to-test code into easy-to-test code
  - **Learning goal**: Learn and understand what a seam is. Learn to introduce seams to make hard-to-test code into 
  easy-to-test code
  - **Learning goal**: Learn 2 tricks on introducing a seam. These works always. Remember: "extract something somewhere!"
- [**Gradual Refactoring Safely**](./gradual-refactoring/README.md): Learn to take one slice at a time, and to push to prod safe changes, never breaking production
  - **Learning goal**: Learn 2 tricks on refactoring big messes safely, without breaking production. 
  - **Learning goal**: Learn to deploy better software in tiny chunks.
- [**Refactoring to Hexagonal**](./refactoring-to-hexagonal/README.md): Use the learnings above to take a production-code look-a-like and with simple
  and safe refactorings, make it testable, well factored and (as consequence) follow hexagonal architecture
  - **Learning goal**: Learn to trust on refactoring skills. 
  - **Learning goal**: Learn about hexagonal architecture

**Other related challenges (that can be also used in online/onsite trainings):**

All these trainings can be also worked together with AI, learning how clear testing & AI can work together.

- [**Frontend Challenges**](./frontend/README.md): This is a place where we can learn WebComponents and using the learnings
  from backend development in frontend. (and never look back to React/Vue again, if we can choose to).
  - **Learning goal**: TBD
- [**Understanding Levels of Coupling**](./understanding-connascence/README.md): This is a practice to experience the different types 
  of connascence in code. And a refactoring exercise to transform connascence to lesser strenght
  - **Learning goal**: TBD (something about using Connascence to guide programming towards safer constructs)
- [**No Exceptions**](./no-exceptions/README.md): This is a refactoring kata to step away from using Exceptions as 
  modern GOTO statements and control flow to make exceptions exceptional (out of memory being an exceptional situation).
  - **Learning goal**: Learn different ways to get rid of exceptional code to make truly exceptional code (one where 
  exceptions are truly exceptional).
- [**All about Test Doubles**](./all-about-test-doubles/README.md): Learn to put difference between _dummy_, _fake_, _spy_, _mock_ and _stub_. This helps
  with naming things and what works wonders with [How to test anything](how-to-test-anything/README.md).
- [**Double Loop TDD**](./double-loop-tdd/README.md): Learn a process that takes focus on a new level. Start with a big test
  (that runs through the whole slice) and work down using TDD until the big test is green. 

## ⚠️ Important ⚠️

If you are using JetBrains products (IntelliJ IDEA, WebStorm, etc), and working with JavaScript, it's best to open 
the specific folder [e.g. 00-setup-your-test-ent](./00-setup-your-test-env) for the session. This way your IDE does
take the specific ESLint config for javascript, and is not confused for having TypeScript and JavaScript files in 
the solution.