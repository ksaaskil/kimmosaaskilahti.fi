---
title: How to lead an engineering team at Google
published: true
description: Reading notes from the book Software Engineering at Google
tags:
  - Reading notes
  - Teamwork
date: 2021-09-08
canonical_url: https://kimmosaaskilahti.fi/blog/2021-09-05-team-lead-at-google/
categories:
  - Career development
authors:
  - ksaaskil
---

# How to lead an engineering team at Google

This article is a summary of the _Chapter 5: How to Lead a Team_ from the book [Software Engineering at Google](https://www.oreilly.com/library/view/software-engineering-at/9781492082781/).

<!-- more -->

## Types of team leads at Google

There are two types of engineering team leads at Google: engineering managers and tech leads. They focus on people's needs and technical needs, respectively.

Engineering manager is responsible for the performance, productivity and happiness of every person on their team, including their tech lead. Engineering manager needs to find the careful balance between the needs of the product and the team.

Tech lead is responsible for the technical aspects of the product, including technology choices, architecture, priorities, velocity, and general project management. Most tech leads are also individual contributors.

On small teams, there can be a "tech lead manager" handling both the people and technical needs of the team. It's very hard to do both of these jobs well in a growing team, however.

All engineering team leads at Google are expected to have an engineering background.

## How to lead, in a nutshell

The best advice for a new manager is "Resist the urge to manage." Even though you're called a manager, you should not actively manage the people who report to you. The symptoms of too much managing include, but are not limited to, micromanaging, ignoring low performers, and hiring pushovers (people that easy to push around).

The most important thing to do as the leader is to _serve your team_. Strive to create an atmosphere of **humility, respect, and trust**. Remove bureaucratic obstacles, help the team achieve consensus, or give them the driving vision. Advise the team when necessary, but do not fear getting your hands dirty. _Manage only the technical and social health of the team._

Historically, managers treated their employees like cart drivers treating their mules: motivate them with a carrot, and if that didn't work, whip them with a stick. This still continues today in many industries. Avoid this like plague.

Engineers working on large codebases can take months to get up to speed on a new team, and these people need nurturing, time, and space to think and create. Managers foster humility, respect, and trust in their team instead of "managing" in the traditional sense. A good manager forges the way for a team, looks out for their safety and well-being, and ensures their needs are met.

> Traditional managers worry about how to get things done, whereas great managers worry about what things get done (and trust their team to figure out how to do it).

It's important to foster psychological safety and create a safe space for taking risks. Let your team know it's OK to fail. Failing is a way to learn a lot quickly, provided that you're not repeatedly failing at the same thing.

A common saying at Google is that if you try to achieve an impossible goal, there's a good chance you'll fail, but if you fail trying to achieve the impossible, you'll most likely accomplish far more than you would have accomplished had you merely attempted something you knew you could complete.

It's OK to fail, but fail as a team and learn from your failures. If an individual succeeds, praise them in front of the team. If an individual fails, give constructive criticism in private.

## Management antipatterns

**Antipattern 1: Hire pushovers**

If you as a manager feel insecure, one way to ensure that no one questions your authority is to hire people you can push around. Strive to hire people who are smarter than you and can replace you. This way, you can learn and grow. If your team doesn't need you anymore, you've succeeded.

**Antipattern 2: Ignore low performers.**

The most difficult part of dealing with humans is handling someone who isn't meeting expectations. The most difficult cases are when someone isn't capable of doing their job no matter how long or hard they work. Here applies the Google SRE motto: "Hope is not a strategy." Do not hope that low performers magically improve or go away. You need to act quickly, before the team morale gets sour or you're so frustrated you can't help them. Set up a time frame and some very specific goals to achieve in that period. Make the goals small, incremental, and measurable. Either the low performer will notice themselves they can't keep up, or they'll up their game to meet the expectations.

**Antipattern 3: Ignore human issues.**

It's common for managers to be stronger in the technical side and ignore human issues. Managers can forget to treat their reports as individuals with specific needs and, for example, enforce the same working habits for everyone.

**Antipattern 4: Be everyone's friend.**

Many newly-promoted leads don't want to lose the friendships they've cultivated with their teams and therefore try very hard to maintain friendships after becoming team leads. This can be a recipe for a disaster. You can lead a team and build consensus without being a close friend or a monumental hard-ass. You can be a tough leader without tossing friendships to the wind. One way to stay socially connected without making the team uncomfortable is to have lunch with the team. Avoid the situation where you end up managing a close friend who is not self-managing and not a hard worker.

**Antipattern 5: Compromise the hiring bar.**

A common (bad) approach to hiring is that when a team needs to hire five engineers, it sifts through a pile of applications, interviews 40-50 people, and picks the best five candidates regardless of whether they meet the hiring bar. This results in a mediocre team. The extra cost of finding the appropriate person pales in comparison to the cost of dealing with an employee who should not have been hired in the first place. This cost manifests in lost team productivity, team stress, time spend managing the employee, and the paperwork and stress involved in firing the employee. Without the raw materials for a great team, you're doomed as a team lead.

**Antipattern 6: Treat your team like children.**

You must respect your team and trust it to get the job done. If it's permanently necessary to micromanage people because you don't trust them, you have a hiring failure in your hands. If you hire people worthy of trust and show these people you trust them, they'll usually rise to the occasion (assuming you've hired good people). Google trusts their employees enough to give them access to self-service "tech stops" where they have free access to all sorts of technical equipment.

## Positive patterns

**Positive pattern #1: Lose the Ego.**

Humility comes first in "humility, respect, and trust". Being humble is not the same as lacking confidence.

Cultivate a strong collective team ego and identity. Trust your team and respect their abilities and prior accomplishments. Giving your team ownership gives them a greater sense of accountability and responsibility.

You do not need to have all the answers. If you act like you do, you will lose the respect of your team. Find people who give you good constructive criticism. Avoid the urge to be territorial.

Apologize when you make a mistake. You need to sincerely mean it. Apologizing does not make you vulnerable. Instead, you will earn respect.

**Positive pattern #2: Be a Zen Master**

Engineers typically develop an excellent sense of skepticism and cynicism. As a team leader, you need to be less vocally skeptical while letting your team know you're aware of the intricacies and obstacles involved in the planned work.

Always maintain your calm. The higher you up in the company hierarchy, the bigger effect your behavior has on the organization. The leader is always on stage and always being watched. Do you show confidence or fear? You attitude spreads infectiously to your team.

A VP of engineering at Google, Bill Coughran, was always so calm that people used to joke that if someone told Bill that 19 of the company's offices had been attacked by space aliens, Bill's response would be, "Any idea why they didn't make it an even 20?"

As an engineer, you're always solving problems and answering questions. In a leadership position, you need to leave the solution mode and enter the asking mode. Help your team find the answers.

**Positive pattern #3: Be a Catalyst**

Catalyze your team. Help them build consensus. Do not rely on authority, unless that's what the team accepts and needs.

**Positive pattern #4: Remove Roadblocks**

Help your team to get moving by removing technical or organizational roadblocks. For example, help the team get the server resources they need. If an engineer is having trouble with an arcane bit of Java code, help them connect with another engineer who can help them. Knowing the right people is more valuable than knowing the right answer.

**Positive pattern #5: Be a Teacher and Mentor**

It can be very difficult to watch a team member spend three hours working on something that you know you could finish in 20 minutes. Giving people a change to learn on their own is a vital component of effective leadership.

To be a good mentor, you only need three things: experience with your team's processes and systems, the ability to explain things to someone else, and the ability to gauge how much help your mentee needs.

**Positive pattern #6: Set Clear Goals**

To make your team move rapidly in one direction, you need to make sure that every team member understands and agrees on what the direction is. You need to set clear priorities and help your team decide how it should make trade-offs when the time comes.

Create a concise mission statement for the team. After the direction and goals are clearly set, give the team autonomy, and periodically check in to make sure everyone is on the right track.

Teams can and do succeed without clear goals, but they typically waste a great deal of energy.

**Positive pattern #7: Be Honest**

Honestly say when you don't know the answer or you're not able to say it. Tell your new team members, "I won't lie to you, but I will tell you when I can't tell you something or if I just don't know."

Giving redirecting feedback is hard. Do not use the "feedback sandwich", because people can easily miss the critical message. Instead, employ respect. Kindness and empathy are critical if you want the recipient to hear the criticism and not go on the defensive.

As an example, if someone is bluntly criticizing every decision made in the team, do not tell them to "stop being a jerk", but honestly tell them the effect their behavior is having on the team.

**Positive pattern #8: Track Happiness**

Take time to gauge your team's happiness. Make certain your team is happy.

For example, keep a spreadsheet of all the grungy, thankless tasks that need to be done and make sure they are evenly spread across the team. In one-on-ones, do not only discuss technical issues but ask how they're enjoying the work and what they're looking forward to next. At the end of one-on-ones, ask "What do you need?" Carefully gauge also their happiness _outside_ of the office. Be sensitive to personal situations and give extra slack to team members going through a tough time.

Most people have goals for the next five years: being promoted, learning something new, launching something important, or working with smart people. Whatever it is, help your team work towards their goals and show you're paying attention to them.

## Miscellaneous tips and tricks

_Delegate, but get your hands dirty._ If you're coming from a contributor role, work hard to delegate work to other engineers, even if it will take them longer than you to accomplish that work. Get your hands dirty taking on a grungy task that no one else wants to do.

_Seek to replace yourself._ Hire people capable of replacing you. When you have team members capable of doing your job, give them opportunities to take on more responsibilities or occasionally lead the team. Remember that some people are happy to be high-performing individual contributors - not everyone wants to lead.

_Know when to make waves._ Issues don't typically go away by themselves. The longer you wait to address them, the more they'll adversely affect the rest of the team. Act, and act quickly.

_Shield your team from chaos and give them air cover._ Chaos and uncertainty are always present. Protect your team from them. Don't distract the team with organizational craziness.

_Let your team know when they're doing well._ Be sure to let everyone know when your team members do well.

_Say "yes" to things that are undoable._ It's OK for the team to try new and bold things, especially if the changes can be undone.

_Feed intrinsic motivation_. You can increase increase intrinsic motivation by giving people three things: autonomy, mastery, and purpose. Autonomous engineers do not need micromanagement. Mastery means that you give people the opportunities to improve existing skills and learn new ones. Finally, if you can help the team see the purpose in their work, you'll see a tremendous increase in their motivation and productivity.

_Don't count apples when you're growing bananas._ When you become a team lead, it becomes harder to quantify your achievements. Developers typically produce something they can point to: code, design document, or a set of tickets. As a team lead, don't count apples when you're growing bananas.

## TL;DRs

- Don't "manage": focus on leadership, influence, and serving your team
- Delegate where possible
- Pay attention to the focus, direction, and velocity of your team
