---
title: How I suffered my first burnout as software developer
draft: false
tags:
  - Philosophy
  - Career
date: 2025-01-12
categories:
  - Career development
authors:
  - ksaaskil
---

# How I suffered my first burnout as software developer

This is the story of how I burned out for the first time in my career as a software developer. It taught me lessons about the importance of self-awareness, work-life balance, and the dangers of not seeing the warning signs.

<!-- more -->

Thanks to the support of some incredible colleagues, I was able to recover relatively quickly and with little long-term damage. I also learned a lot about myself and what I need to thrive in both my professional and personal life. In this post, I’ll share the story to hopefully help others spot the warning signs earlier and avoid falling into the same trap.

## Background

Between 2020 and 2023, I worked as a senior software developer at a Finnish AI consulting company. My main role was in an R&D team focused on building internal tools, and much of my time went into leading the development of an annotation tool. This tool helped create training data for machine learning models, handling both image and text annotations.

Occasionally, I also joined client projects as a consultant. At the end of 2020, I joined a half-time project at a client that generated synthetic training data for computer vision. My job was to write software that turned raw, synthetic training data into visualizations.

While I gained valuable experience working with large-scale image datasets, the project felt uninspiring. The work was quite mechanical, involving little problem-solving or creativity. I built a data transformation pipeline that was very useful and important, but not particularly fulfilling. I frequently shared my frustration with my account owner, asking to move to something closer to my aspirations in machine learning. By spring 2021, the project wrapped up, and I transitioned back to full-time internal product development.

In the spring of 2021, I joined a new internal R&D team focused on developing MLOps tools. The goal was interesting: to create a Kubernetes-based platform that could support our internal projects, be used for educational purposes, and even be offered as a product or service to clients. This work was part of the European IML4E project, and eventually, the platform we built was released as [open-source software](https://github.com/OSS-MLOPS-PLATFORM/oss-mlops-platform).

Being part of the MLOps team was a highlight of my time at the company. The team dynamic was excellent and I felt a big sense of belonging. The group brought together deep expertise in ML software development and firsthand knowledge of the challenges faced in client projects. It was inspiring to work alongside such talented and motivated people.

However, monetizing our work proved to be a challenge. Despite technical successes, turning the platform into a viable commercial offering was difficult. Over time, team members were gradually reassigned to client projects—first part-time and eventually full-time.

By spring 2022, I was promoted to lead software developer and returned to working on the internal annotation platform. However, I was soon asked to join a new client project that involved MLOps.

## The client

The client was a Finnish technology company developing both hardware and software. My role in the project was to work directly with the company’s chief architect—whom I’ll refer to as "the client." Alongside another engineer from our consulting company, we formed a small three-person team.

Within the client organization, different teams worked independently on their own projects, each with unique objectives. Collaboration between teams seemed to be rare, and most operated in silos. There was no shared tooling for data engineering or ML development across the organization. While some teams had experimented with MLOps tools to streamline their workflows, these experiments were limited to proof-of-concept stages and lacked broader adoption.

Our mission was to help the client identify and adopt shared tooling to accelerate the development of ML-based solutions. We also needed to centralize the company's scattered data into a single, unified location. This would reduce duplicate data collection efforts and unlock new opportunities for data-driven innovation.

In hindsight, the project was ambitious, concerning not just technical challenges but also cultural ones–to encourage teams to break out of their silos and adopt a more collaborative approach.

I joined the project as a half-time contributor, splitting my time evenly between working for the client and leading the development of our internal R&D tools. The arrangement was unstructured: aside from working at the client’s office every Wednesday, there were no fixed hours for client work during the week. It was up to me to manage my schedule and ensure that by the end of each week, 50% of my time had been dedicated to the client.

The client organization had strict policies about tools and communication. We were not allowed to use our company’s software or email accounts for client work. Instead, we were given Microsoft accounts within the client’s domain and were required to use their approved software. This included installing client administration software on our computers and relying on tools like Outlook for email. Communication with the client happened primarily via email, with daily meetings serving as the only exception.

Our client, the chief architect, held a unique position in the organization. They weren’t tied to any specific team but instead acted as a kind of overseer. Their role seemed to be to guide teams toward adopting efficient tools and practices that would enable them to build better solutions more quickly. However, each team within the client organization operated independently, with their own project owners focused on meeting their specific objectives.

This dynamic created friction. Teams prioritized their immediate goals and deadlines, which often clashed with our client's broader vision of long-term efficiency and collaboration. As a result, getting buy-in from teams for any changes or new tools was a challenge, and this tension turned out become critical in the project.

## Summer

Our first task for the client was to evaluate various MLOps solutions available on the market. Over the summer of 2022, we conducted small proofs-of-concept with multiple MLOps platforms. However, because we weren’t collaborating directly with the teams we were supposed to support, these proofs-of-concept were built with simple toy examples instead of using real datasets or models from the company's daily work.

Once the evaluations were complete and documented in a big spreadsheet, we presented our findings to the teams. The chief architect delivered the presentation, highlighting the tools and platforms we had tested and announcing the choices made for adoption. The reception was lukewarm.

Looking back, the presentation reflected deeper issues with the organization’s top-down culture. Rather than openly sharing our findings and inviting feedback from the teams, the presentation aimed to sell them the tools pre-selected by our team. The presentation even downplayed or omitted some of the challenges we had faced during testing, in an effort to make the recommendations more appealing. This approach, I think, undermined trust and made it harder to gain the teams' buy-in.

During this evaluation period, I also started noticing a lack of trust from our client. They seemed reluctant to let us work independently and micromanaged the process. Even during their summer holiday, they expected us to meet with them online multiple times a week to provide updates. This constant oversight added a lot of pressure and left little room for autonomy in our work.

## Autumn

After the MLOps tooling evaluation, our focus shifted to data engineering. Some teams in the company were already using some Python libraries to manage and process their datasets. The client was determined to build a data lake for the organization. The vision was to make the datasets accessible via a data catalog and a notebook-based compute platform.

To demonstrate this concept, we built an internal demo using one of the cloud platforms. The goal was to show the teams how easily they could access company-wide datasets through the data catalog and the platform. Preparing for the demo exposed more of the top-down culture within the organization. Our client wanted the demo to be flawless with no room for technical issues, no mention of unsolved challenges. The solution had to appear polished and ready, even though it was still in its early stages.

One major challenge we faced was how to handle authentication and authorization for multiple teams in a scalable way. This was a critical issue, but instead of addressing it collaboratively with the teams, our boss pushed us to solve it immediately, even before a single team had committed to using the new notebook-based cloud platform. They wanted the solution to seem perfect upfront, likely fearing that any imperfection might dissuade the teams from adopting the platform.

Looking back, this approach exemplifies what platform teams should not do. A platform team’s role is to support other teams, enabling them to deliver better solutions faster—not dictate what tools they must use. When platform teams adopt a top-down approach, they risk alienating their users, which often results in resistance and pushback.

Part of the demo also included convincing teams to store their training datasets in Amazon S3 instead of relying on internal REST APIs. During the discussion, one developer pointed out that S3 is an API too. The chief architect responded with visible frustration and condescension, saying that S3 is a cloud object storage, not an API. The room went silent, and the conversation ended there.

Of course, both perspectives were valid. S3 is an API—one designed for scalable storage and retrieval. S3 offers clear benefits for analytical tasks like machine learning. But instead of clearly and respectfully communicating those advantages, the architect’s dismissive tone shut down the discussion. At that moment, I realized that pushing teams to adopt something new without earning their trust or addressing their concerns was unlikely to succeed.

By the autumn, the micromanagement from our client had intensified. I found myself increasingly stressed, juggling emails and meeting invites across two separate systems and trying to keep track of events in two calendars. There were no scheduled daily meetings; instead, meeting invites would appear with only a few hours' notice.

One morning, I forgot to check the client email and missed a 10 a.m. meeting that had been scheduled that morning or previous evening. I felt awful about it, and after the incident, the client insisted that we report to them with hour-level precision—detailing when we worked and what we accomplished during that time.

I have always been a conscientious worker. I take pride in my work, reflecting on the problems and challenges outside of office hours and always striving to improve my skills to do my job as well as possible. The constant oversight and visible lack of trust from the client was a hard blow to my self-esteem.

## My last task

One of my last tasks at the client was to set up data ingestion from the client’s internal message broker to the “data lake” in S3. However, I lacked the credentials to connect to the broker. To resolve this, I was instructed to contact an employee in the client organization who could provide the necessary permissions. This turned into weeks of waiting until the employee would have the time to help me with the credentials.

As part of the task, I also needed to build the necessary infrastructure in AWS. The client organization primarily relied on “click-ops,” manually configuring resources through the AWS Management Console, and had not yet embraced Infrastructure as Code (IaC). Since we wanted to introduce IaC to streamline processes, I asked the client if they had a preferred tool, such as [Terraform](https://www.terraform.io/), [AWS CDK](https://aws.amazon.com/cdk/), or [Pulumi](https://www.pulumi.com/). Their response was vague: “Any tool will do.”

I chose AWS CDK (Cloud Development Kit), which was gaining traction at the time and was the recommended IaC tool from AWS. AWS CDK allowed developers to define infrastructure using familiar programming languages like TypeScript or Python, which then compiled into CloudFormation templates. Compared to purely declarative tools like Terraform, AWS CDK offered the flexibility and expressiveness of a full programming language, which seemed like a clear advantage.

After spending a few days building the initial infrastructure with AWS CDK, I was ready to present my progress to the client. When I showed him the code, he glanced at it for a few seconds and said that using AWS CDK was the wrong choice. Infrastructure should not be defined with code. It must be defined with configuration files. I should have used Terraform.

At that point, I was too exhausted to argue. In hindsight, I’m not even sure he knew what AWS CDK was. Perhaps he assumed I was writing imperative commands using the AWS SDK rather than employing an IaC tool. Whatever the case, his quick dismissal of the work felt unfair and demotivating.

This incident was the last straw to me. After weeks of battling organizational hierarchy, dealing with inconsistent guidance, and feeling like my efforts weren’t valued, my motivation plummeted. It became increasingly hard to muster the energy to keep going.

## The crash

One morning, I had a video call with a dear colleague from our internal MLOps team. We were catching up on some of the work we had done together. But during the call, I noticed that something was wrong. I couldn’t focus on what my colleague was saying. My thoughts scattered and I felt nausea and dizziness. I had to cut the call short, apologizing to my colleague and explaining that I wasn’t feeling well. I went home and decided to take the rest of the day as sick leave.

The next morning, as I walked the short distance to the bus stop—200 meters from my home—I noticed I was out of breath. My heart raced and pounded in my chest with every step. The mere thought of commuting to work filled me with dread. That’s when I realized that something was seriously wrong. I wasn’t just tired or stressed–I was sick.

The following days are a bit of a blur. I reached out to occupational healthcare, explaining my symptoms to the doctor. His response was disappointingly indifferent. He gave me two or three days of sick leave and told me to discuss my situation with my employer. I didn’t feel understood and their lack of empathy made me question whether my situation was even serious enough to warrant help.

I then spoke to one of the managers in my company. He suggested that I take a few more days of sick leave and try to return to the client project afterward. He also assured me that he would speak with my account owner to explore ways to improve my well-being at work.

But the idea of returning to the client project was awful to me. I could not go back—not without jeopardizing my health further. I felt trapped–there didn’t seem to be a clear way out of the project. Leaving the project felt like I would be letting everyone down—my client, my colleagues, and my company. I worried I would cause serious damage to the project, simply because I couldn’t handle the pressure.

On top of everything, I felt an overwhelming sense of shame. As a lead developer, I was supposed to set an example. How could I admit that I was struggling so much in a simple half-time client project? These thoughts made it even harder to see a way forward.

## Path to recovery

During my sick leave, I tried to focus on recovery by taking long walks. At first, I was consumed by anger. I was furious with the client, replaying everything I felt they had done wrong. My gaze was fixed on the ground, my mind looping through bitter thoughts.

But over time, I started lifting my head and noticing the world around me—the wind in the trees, the breeze on my face. Slowly, I started to appreciate these small moments. I felt gratitude and felt that I was starting to recover.

I knew I had a few dear colleagues I could lean on. They weren’t just coworkers but even friends—the kind of people who genuinely cared. I arranged a video call with two of them, both of whom were kind and understanding. When they asked how I was doing, I opened up and shared everything I had been holding in. I shed some tears, and it felt like a release. All the dark thoughts came out and I trusted them to listen without judgment as I knew they cared about me as a person, not just as a colleague.

After those calls, my account owner reached out to me. He told me I didn’t need to return to the client project. He reassured me that someone else would take over and that my health came first. In an unexpected moment of empathy, he shared his own experiences with burnout. He understood my experience and approved of my decision to step away.

That call was one of the great moments of relief in my life. For the first time in months, I felt like things might actually get better.

I was away from work for only one to two weeks. I consider myself very lucky to have climbed out of the pit so quickly. I owe much of that to my incredible colleagues and their support. In hindsight, it might have been a blessing that my sick leave was relatively short as it forced me to confront my fears and face the reality of returning to work sooner rather than later. Returning to work pushed me to actively try to fix and improve the situation rather than avoid it.

I know many people endure much more severe burnouts, with recovery taking months or even years. Mine wasn’t serious in that sense, but I do believe that without the support of those amazing colleagues, it could have been much worse. Their kindness and understanding were very important to me, and I'm very grateful for the role they played in helping me climb out of that dark place.

## What I learned

My burnout recovery period was also a time of reflection and learning about what I need to thrive professionally. The insights I gained revolve around the concept of intrinsic motivation—the internal drive to engage in an activity for its own sake—and its [four key pillars](https://frankmartela.fi/2012/07/02/the-four-ultimate-elements-of-motivation-how-to-get-the-best-out-of-you-and-others-and-how-robots-will-save-the-world/): autonomy, competence, relatedness, and beneficence.

A significant factor in my burnout was a lack of autonomy. Autonomy is about feeling in control of your actions and decisions, being the author of your own work rather than a passive executor of someone else’s instructions.

In my client project, autonomy was very limited. I was often told what to do and which tools to use, making me feel like a cog in a machine. My role was to complete tasks dictated by my superior rather than being actively involved in the decision-making process. Two colleagues of mine working in other teams at the same client reported similar frustrations. They also felt constrained, primarily tasked with working through pre-defined backlog tickets.

Autonomy doesn’t mean you can do what you want and when you want. Autonomy means being involved in the entire problem-solving process: understanding why a problem matters to the business, having the opportunity to ask questions and challenge assumptions, and collaborating on how best to address the challenge. It’s about contributing meaningfully to the direction and execution of the work.

Competence—the feeling of mastery and effectiveness—was another area where I struggled at the client. While I felt I had the necessary skills for the project, the organizational structure and lack of effective collaboration created unnecessary barriers. Simple tasks were made unnecessarily difficult, and asking for help or clarifications was harder than expected. This undermined my ability to contribute as effectively as I wanted to, leaving me feeling frustrated and underutilized.

Relatedness—the need for connection, belonging, and social support—was also a challenge. My sense of connection with the client was minimal, and my interactions with the other consultant on our team were infrequent. After the platform evaluation phase, our work became largely separate and our collaboration dissolved. This left me feeling isolated and unsupported, feeding the feelings of helplessness.

Finally, beneficence—the sense that your work contributes to the well-being of others or serves a greater purpose—was notably absent. Like most people, I want to feel that my work is meaningful and impactful. At the client, I had serious doubts about the value of our contributions. I had little confidence that the solutions we developed would be adopted by the client’s internal teams. The possibility that my efforts might go to waste made me question the purpose of my work and if it truly mattered.

## Aftermath

I am no longer angry at the client, nor do I harbor any negative feelings toward them. I can see now that I was simply not a good fit for the team. Another colleague from our company took over my role on the project and seemed to flourish in the team. It was a reminder that one very important factor determining success is how one’s working style aligns with the environment and team dynamics.

In hindsight, there were several signs of burnout that I failed to recognize at the time. I had started neglecting my physical well-being by skipping my morning yoga sessions and afternoon exercise breaks. I also abandoned the habit of regular personal retrospectives—reflecting on my progress, learning, and long-term goals every two weeks. These small rituals were important for maintaining a sense of balance and purpose in my work. In the future, I try to be more vigilant in recognizing these early warning signs and take action before they escalate.

This journey has taught me important lessons about, for example, the importance of self-care, alignment with one’s environment, and the need for balance between work and well-being. I am now also grateful for the experience, because it hopefully gave me the perspective and tools to prevent similar situations in the future.

Thank you for reading. I would love to hear your thoughts—please feel free to reach out to share your feedback or ask any questions!
