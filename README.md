### what's this self awareness thing

So there was this tweet, https://twitter.com/goodside/status/1610879587319177216, about self awareness and i realized i didn't know what it was or if it was important, so figured i'd make this repo to figure out wtf it was and what happened if we gave it to an agent.

So I don't know all that much about what self awareness means, but i figure that we can see what it looks like for something to be aware of it's own thoughts by having an agent that;
1) has a thought-state
2) has some function F that evaluates that thought state
3) F is able to put into that thought-state that F has evaluated that thought state

I don't particularly expect anything crazy to emerge out of this (and particularly, i suspect that people think the emerging self awareness is the intersting bit not forcing it in like this) but i figure it's worth playing with to try to figure out what it even looks like and how it works.

### Lessons Learned

I went through 2 iterations of this, probably going to iterate to a third on some of the lessons learned. What this ends up doing is it has a thought cycle that's constantly evaluating what's going on. Whenever the user sends input, it just adds to the thought cycle that the user told it something and then it can eventually decide to do something about it.

in v1, everything was just updating a single state, but it was hard to get it to do anything interesting. In v2, there's a traditional chatbot history, of 
[thought, thought, thought]. This allows it to track what's happened somewhat, but the problem is there's still a bit too much hallucination between what it actually told the user and what it thinks it wants to tell the user. I suspect for v3 I need to break it down more for multiple queues, where there's
{
  currentThough: str,
  thoughtHistory: str[],
  interactionHistory: str[]
}
and this might help with some of the hallucination.

### Cool prompt stuff
So the coolest thing about the prompt is hallucinated functions work _really really well_. Huge fan of using typescript interfaces to define specific outputs - see `linearPlanner.tsx` for the most interesting one i think.


#### important!
I don't know typescript that well so this should be fun

### Requirements

- Node.js and npm

### Getting started

Run the following command on your local environment:

```
npm install
```

Then, you can run locally in development mode with live reload:

```
npm run dev
```
