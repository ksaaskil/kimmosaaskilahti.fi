---
title: Software R&D in a service company
published: false
description: What I've learned during my two years as an R&D developer in a consulting company
tags: 
//cover_image: https://direct_url_to_image.jpg
---

I've been part of R&D in a service company for almost two years now. By service company, I mean consulting: we help other companies solve problems. Working in R&D in a service company has some interesting differences to R&D in product companies in which I've worked previously. 

Background

Let me start by listing some of the unique features that the client work adds.

The first is the diversity of clients whose problems we're solving. Their use-cases and technology stacks can be wildly different. Therefore, the first constraint is _flexibility_. 

Second, we have nearly 200 experts in our company, with very different backgrounds and skill sets. They need to be able to read the code and tailor it to the clients' needs. The second constraint is _simplicity_.

These internal experts contribute to R&D code also directly outside client projects. Simple code empowers them to deliver new features fast and with confidence. For us permanent members of R&D, we need to be able to ensure continuous reliability of the software. The constraint is _ease of onboarding_.

We need buy-in from internal experts.

Developing code in a service company also brings some liberties.

The first liberty is that our code does not need to fulfil all possible needs of all possible users: it can leave room for customization. This can lead to simpler, more efficient designs.

The second liberty is that our products don't need to be as polished from the outside as off-the-shelf products. The time saved from polishing can be spent on delivering business-critical value. We don't take shortcuts in quality, of course. 

Finally, we develop R&D software like in any other company. We write automated tests to improve the design and ensure our precious features keep working far to the future. When we get harsh feedback, we pat ourselves on the back: we got the software to the hands of users and now we know what to improve. When a project fails, we congratulate ourselves: instead of participating in “innovation theatre”, we used analytical methods to kill off a thing that didn’t work.
