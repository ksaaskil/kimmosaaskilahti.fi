---
title: On the dangers of large language models and whether they should be public
draft: true
description: Some thoughts on AI threats, open source and what to study
tags:
  - Philosophy
date: 2023-07-21
categories:
  - AI
authors:
  - ksaaskil
---

# On the dangers of large language models and whether they should be public

_A man who is not afraid of the sea will soon be drowned, he said, for he will be going out on a day he shouldn't. But we do be afraid of the sea, and we do only be drownded now and again._ -John Millington Synge

<!-- more -->

The release of ChatGPT made the general public aware of large language models (LLMs). Pre-trained models like [GPT-4](https://openai.com/research/gpt-4) have [stunned researchers](https://arxiv.org/abs/2303.12712) by their better-than-human performance in tasks requiring deductive reasoning. LLMs do not just parrot the information they have learned but are able to combine it in novel ways (SOURCE).

<!--LLMs fall under the larger umbrella of [foundation models](https://www.adalovelaceinstitute.org/resource/foundation-models-explainer/) (FMs). Foundation models are models pre-trained on huge internet-scale datasets to handle specific tasks such as text-to-text or text-to-image generation. Training FMs from scratch is in reach only for tech giants.-->

In March 2023, Future of Life institute published the open letter called [_Pause Giant AI Experiments_](https://futureoflife.org/open-letter/pause-giant-ai-experiments/) that was signed by technology leaders such as Yoshua Bengio, Steve Wozniak, Stuart Russell and, yes, the infamous Elon Musk. The letter called for "_all AI labs to immediately pause for at least 6 months the training of AI systems more powerful than GPT-4_". The letter went on to say that "_AI labs and independent experts should use this pause to jointly develop and implement a set of shared safety protocols for advanced AI design and development that are rigorously audited and overseen by independent outside experts._"

The letter initiated a good and healthy discussion about the dangers of AI among the AI community. Industry leaders like Yann LeCun of Meta and Andrew Ng of DeepLearning.AI [opposed the pause](https://www.youtube.com/watch?v=BY9KV8uCtj4). Meta AI (lead by LeCun) decided to [publish](https://about.fb.com/news/2023/07/llama-2/) their latest large language model called [Llama 2](https://arxiv.org/abs/2307.09288) to everyone with a custom [license](https://github.com/facebookresearch/llama/blob/main/LICENSE). Meta calls this the "open approach to today's AI", for which they [gathered a list of supporters](https://about.fb.com/news/2023/07/llama-2-statement-of-support/).

The decision seems to have been made for us: large language models are not inherently dangerous. There are known and unknown risks associated with them, but we just need to trust tech giants like Meta when they [say](https://about.fb.com/news/2023/07/llama-2/) they are "committed to building responsibly".

Meta's responsibility record does not look particularly good. Amnesty Internal report on the 2017 events in Myanmar [said that](https://www.amnesty.org/en/latest/news/2022/09/myanmar-facebooks-systems-promoted-violence-against-rohingya-meta-owes-reparations-new-report/) "_Facebook owner Meta’s dangerous algorithms and reckless pursuit of profit substantially contributed to the atrocities perpetrated by the Myanmar military against the Rohingya people in 2017"_. In the [Cambridge Analytica data scandal](https://en.wikipedia.org/wiki/Facebook%E2%80%93Cambridge_Analytica_data_scandal), the personal data of 87 million Facebook users [was made available](https://www.bbc.com/news/technology-64075067) to a third party without their consent and used for voter profiling and targeting in Donald Trump's presidential campaign. Mark Zuckerberg [famously called](https://www.newyorker.com/magazine/2010/09/20/the-face-of-facebook) the people who trusted him with their data as "dumb f\*cks".

Meta is a marketing company. Like Google, Meta makes money by selling targeted ads. Their core business is not to build state-of-the-art AI models. Therefore, they have a lot less to lose in making models publicly available than companies like OpenAI.

It must be acknowledged that Meta has contributed a lot to open source. [React](https://react.dev/) is the leading framework for web and mobile applications. [PyTorch](https://pytorch.org/) is the leading framework for AI research. The compression algorithm [zstd](https://en.wikipedia.org/wiki/Zstd) is used even in Nintendo Switch.

However, I have also been somewhat disappointed to see the letter being dismissed either as a misunderstanding of how current AI systems work, as Elon Musk's marketing gimmick, or as an attempt to slow down competition.

For example, the Finnish Mikrobitti magazine recently described the letter as a warning about a conscious superbeing turning against humanity. Given that the article had just explained how LLMs are nothing more than text-to-text generators, this made the letter look ridiculous. How could a simple text-to-text generator become conscious?

I don't know if the author had even read the letter, but to me, this misunderstanding is a good example of the power of science fiction. Try googling for images with "AI existential threat" and you'll find pictures of menacing human-like robots that look like the Terminator.

What did the letter then warn us about?

Sam Altman, the CEO of OpenAI, was [interviewed by ABC News](https://abcnews.go.com/Technology/openai-ceo-sam-altman-ai-reshape-society-acknowledges/story?id=97897122) in March 2023. He's not worried of omnipotent superbeing taking control: _"A common sci-fi fear that Altman doesn't share: AI models that don't need humans, that make their own decisions and plot world domination._" However, he is worried of which humans will be in control of these powerful AI systems.

Consider that you're an unpopular dictator waging war against a neighbor country. You have eliminated almost all of your skilled generals in fear of a coup. You lack skilled strategists and you are given the opportunity to let an AI system take control of your troops such as autonomous drones. Sometimes the system makes bad mistakes that leads to the deaths of a lot of soldiers, but that's a price you're willing to pay. What would stop you from trying it out?

## Case of Meta

## Disinformation: Robot calls, spam, deep fakes and all that

## Plugins allow FMs to interact with our world
