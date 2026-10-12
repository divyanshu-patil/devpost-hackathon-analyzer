(() => {
  // t: applies to which hackathon type ('all' = every hackathon). e: evidence from the 145 analysed hackathons.
  const TYPES = { all: 'Every hackathon', sponsor: 'Sponsor / corporate online', inperson: 'In-person university', deploy: 'Must-deploy & growth', web3: 'Web3', games: 'Games & creative' };
  const SECTIONS = [
    { h: '1. Decode the rules before writing any code', when: 'Day 0, about 30 minutes', items: [
      { t: 'all', x: 'Copy the judging criteria into a doc and highlight the one line that only this hackathon has.', d: 'Generic lines (impact, creativity, design) appear almost everywhere, so they don\'t separate entries. The unique line decides it: "xStocks Relevance & Depth 30%", "Audience Fit 30%", "how well the idea is leveraging Kiro", "Autonomy 20%", "revenue in the 90-day window". Write down how your demo proves that line in its first 30 seconds.', e: 'xPrime made xStocks the core primitive. Preplo built for one creator\'s exact audience. Polyfork showed agents running the business.' },
      { t: 'all', x: 'Write down the weights and split your time to match them.', d: 'If Technical Implementation is 40–50% (Gemini 3, ADK, Cloud Run, GKE, MLB), spend the time on depth of sponsor-tech use and an architecture diagram. If Demo/Presentation is 30–40% (Cloud Run, GKE, Gemini Live, MLB), plan to spend about 25% of total time on the video alone.', e: 'In Cloud Run and GKE, demo and technical were each 40%. In ADK, technical was 50%.' },
      { t: 'all', x: 'List every hard disqualifier as a pre-submit gate.', d: 'Examples from these hackathons: Kiro required a /.kiro folder at repo root that isn\'t gitignored. GitLab ruled that chat-only agents don\'t qualify. Bolt required a "Built with Bolt.new" badge on the deployed app. RevenueCat required v1 released inside the window. NEAR required the agent running on testnet or mainnet. UiPath required it to run on Automation Cloud. MNEE required use of one specific contract address.', e: 'These are pass/fail checks done before any scoring.' },
      { t: 'all', x: 'Check whether prior work is allowed, and how they verify it.', d: 'Most student hackathons ban pre-existing code and check commit history (Bay2Bay literally scores "Deadline" from commit dates and YouTube upload date; YHack says "We WILL check your GitHub repo"). Starknet allowed existing projects but scored "Progress During Hackathon". Commit small and often from minute one. A single giant commit looks like imported code.', e: 'Bay2Bay, YHack, United Hacks, Starknet Re{Solve}.' },
      { t: 'all', x: 'Map every sponsor, track and bonus prize you can win without changing your idea.', d: 'Winners routinely stacked 3–4 prizes from one project. Pick 2–3 sponsor tools that fit naturally and integrate them properly rather than as name-drops. Bonus prizes (blog post, social posts, "best solo", "best first hack", community vote) get far fewer entries.', e: 'Shepherd won the grand prize plus two OpenEvidence awards. StarkFlow won 4 prize pools. 14 Kiro winners took the Bonus Blog Prize.' },
      { t: 'all', x: 'Note the video rules: max length, public vs unlisted, allowed platforms.', d: 'Most say judges "are not required to watch beyond 3 minutes". Some require public YouTube/Vimeo (Kiro), some accept unlisted (Hacktech), and Cal Hacks wanted a local recording plus a table pitch.', e: '' },
    ]},
    { h: '2. Choose the problem the way winners did', when: 'Day 0–1', items: [
      { t: 'all', x: 'Find a citable statistic for your problem before you build.', d: 'Nearly every top winner\'s Inspiration section opens with a sourced number, and the number becomes the hook of your video. Put the source (KFF, NIH, WHO, a paper) in the write-up.', e: 'Overturn: "insurers denied 19% of claims, fewer than 1% appealed (KFF)". WhaleBeing: "20,000 whales killed by ships per year". Aorta: "sepsis kills 11M per year, +8% mortality per hour of delay".' },
      { t: 'all', x: 'Write one sentence that explains why your team owns this problem.', d: 'Domain insiders and people with lived experience won first places repeatedly. If nobody on the team has that link, interview one real user during the hackathon and quote them.', e: 'veTriage was built by a vet clinic owner, Pulse by a cardiologist, Theracat by a former anxiety clinician, Shepherd for blind users, and Lucid Voice for people who can\'t speak.' },
      { t: 'all', x: 'Name one specific user, not a market.', d: '"Receptionists at vet clinics on sick-pet calls" beats "pet owners". "Seniors in Japan who only trust fax" beats "elderly people". A specific user makes the demo concrete and the impact believable.', e: 'Faxi (Japanese seniors via fax), ServeTrace (NYC debt-case defendants), Edu.AI (3.9M ENEM test-takers).' },
      { t: 'all', x: 'Write a "X for Y" or "Cursor for Z" tagline judges can repeat back.', d: 'Judges see 50–500 projects. An analogy is what they remember in deliberation.', e: '"Duolingo for endangered languages" (LanguaLegacy), "TaskRabbit for Nigeria" (MyFixam), "Cursor for surgery" (Robosurge), "Cluely for seniors" (Agely), "BlackRock for everyone" (Axis).' },
      { t: 'all', x: 'If your idea is in a crowded category, add one hard differentiator.', d: 'Crowded categories here included AI study buddies, resume helpers, generic chatbots and to-do apps. Differentiators that worked: real hardware, a narrow underserved user, an unusual public dataset, or on-device/offline operation.', e: 'Tech Titans 1st (CareCase) beat a field of AI tutors with a Raspberry Pi clinical simulator. Chrome AI "Most Helpful" winners used on-device AI because privacy was the point.' },
      { t: 'all', x: 'Seriously consider accessibility, health or safety.', d: 'These domains took a disproportionate share of overall prizes. Usable-without-hands, without-speech or without-sight projects won outright repeatedly.', e: 'All 3 ShellHacks 2026 Best Overall winners, both Chrome AI "Most Helpful" winners, Second Voice (OpenAI 1st), Glint and Clench (ALS).' },
      { t: 'sponsor', x: 'Run the swap test on the sponsor\'s tech.', d: 'If you could replace the sponsor\'s product with a competitor\'s without changing the demo, you are under-using it. Build around the feature only they have, ideally the newest one launched for this hackathon.', e: 'Globot used Gemini\'s 2M-token context. ORION used Live API interruptions for hands-busy surgeons. Star Chasers used Horizon world streaming. Nutshell used Chrome on-device AI for privacy.' },
      { t: 'sponsor', x: 'For partner tracks, do exactly what that partner\'s brief asks, applied to a high-stakes domain.', d: 'Datadog wanted end-to-end LLM observability with detection rules and incidents. Confluent wanted real-time streaming. Elastic wanted hybrid search. Winners did that literally, in health or safety.', e: 'Skinnova (Datadog: what if a domain-advice LLM hallucinates?), Aorta (Kafka sepsis alerts), Procheck (semantic search for ER protocols).' },
      { t: 'games', x: 'Pick a proven genre loop and execute it really well, rather than inventing a new genre.', d: 'Meta Horizon grand prizes went to rhythm, cozy-restore, tycoon and creature-collector games with polished art, onboarding and social hooks. AI-film winners told culturally specific human stories, with AI serving the narrative.', e: 'Kpop Fever, Dino Mart Tycoon, Creature Quest. Railbound and Before Mount Rushmore (Chroma).' },
      { t: 'web3', x: 'Look for a "first X on chain Y" gap and make the sponsor\'s asset the core primitive.', d: 'Ecosystem judges reward filling obvious missing infrastructure more than clever but peripheral dApps.', e: 'ElectroSwap (first DEX on Electroneum), Starknet-x402 (first x402 on Starknet), xPrime (prime brokerage for xStocks).' },
    ]},
    { h: '3. Build for the judging session, not for a roadmap', when: 'Build phase', items: [
      { t: 'all', x: 'Get one complete user flow working end to end before adding a second feature.', d: 'Rubrics explicitly penalise fragments: Knight Hacks asks "Is the project end-to-end, or still largely fragmented?", ShellHacks scores "Completion", and OpenAI asks for "a complete, coherent product experience, not just a technical proof of concept".', e: '' },
      { t: 'all', x: 'Deploy a clickable URL, and add a demo mode that skips sign-up.', d: '61% of online winners and 74% of must-deploy winners linked a live demo. Judges won\'t create accounts. Add ?demo=1, a guest login or pre-seeded data.', e: 'Tailored Labs linked /dashboard/?demo. Clerkmark linked /?demo=1.' },
      { t: 'all', x: 'Seed realistic sample data and add fallbacks for flaky APIs.', d: 'Judging often happens days later, when your free-tier key may be rate-limited or expired. Cache one golden-path response so the demo still works.', e: '' },
      { t: 'all', x: 'Make the public repo judge-ready: README with setup, architecture diagram, where each sponsor tool is used, and .env.example with no real keys.', d: '77% of submit-only winners had a public repo. HP made documentation 25% of the score and warned "make sure NOT to add any secret APIs". DeltaHacks reassigns prizes if the repo goes private after the event.', e: '' },
      { t: 'all', x: 'Make AI output verifiable: citations, sources, refusals and confidence.', d: 'Hallucination handling is now scored explicitly (Gemini Live: "Does the agent avoid hallucinations? Is there evidence of grounding?"). Showing a refusal or a citation on screen is a cheap way to earn trust.', e: 'Mechanica\'s docent "refuses to hallucinate". Overturn cites "sourced rights". Clerkmark checks citations against CourtListener.' },
      { t: 'sponsor', x: 'For agent hackathons, show the agent acting on a trigger without a human in the loop, and show its steps on screen.', d: 'GitLab disqualified chat-only bots and wanted "agents that react to triggers and take action". Ship to Prod scored Autonomy at 20%. A visible step log proves real agent behaviour.', e: 'LORE, Gitdefender, Branch (GitHub issue → PR in minutes), Phalanx.' },
      { t: 'sponsor', x: 'Deploy on the sponsor\'s cloud if they host the hackathon, and capture proof.', d: 'Gemini Live asked for "visual proof of Cloud deployment". Cloud Run and GKE required it. Screenshot the console or service URL for the video and gallery.', e: '' },
      { t: 'inperson', x: 'If you can, add a physical component and bring it working to the table.', d: '13% of in-person winners had hardware vs 3% online, and hardware dominated the overall prizes (Shepherd cane, Circa irrigation sensors, Restful Knights sleep screener, Theracat band). Have a backup video of it working in case it fails live.', e: '' },
      { t: 'inperson', x: 'Every team member must be able to explain any part of the stack.', d: 'Knight Hacks scores "Do the presenters actually know what they\'re talking about?" and rewards admitting which tools helped. Rotate who explains what during rehearsal.', e: '' },
      { t: 'deploy', x: 'Polish beats novelty: make onboarding self-explanatory in under 20 seconds and test on the target device.', d: 'Platform judges are product teams. Meta criteria literally include "Fun in 20 seconds", "Best Onboarding Experience" and mobile ergonomics.', e: 'Ship It! (top prize) was a dead-simple pack-and-ship loop. Haunter, Gatherer warned "play on mobile, not web".' },
      { t: 'deploy', x: 'Release in week 1, then iterate and keep dated metrics.', d: 'Growth contests judge what happened after launch. Track downloads, MRR, retention and conversions from day one with screenshots.', e: 'Payout won Build & Grow by "releasing early and iterating". ReadHim: 6M+ views, $1,100 MRR. ActinGym: $8,149 revenue, 133 paying customers (XPRIZE).' },
      { t: 'deploy', x: 'For update competitions, record before/after evidence.', d: 'Show before/after screenshots and a changelog of exactly what you added.', e: 'Color Switch and Power Wash (Meta Elevate) posted before/after images and "37 new vehicles".' },
      { t: 'web3', x: 'Deploy contracts to the required network and link the explorer.', d: 'NEAR, MNEE and Electroneum required the project running on chain. Put the contract address and explorer link in the README and in the video.', e: 'AI Apocalypse Chain showed its deployed contract and block explorer.' },
    ]},
    { h: '4. Write the Devpost page like a product page', when: 'Last 6 hours', items: [
      { t: 'all', x: 'Tagline: outcome plus specific user, ideally with a number, under ~150 characters.', d: 'The tagline shows on the gallery card, which is often all a screener reads.', e: '"Upload any blurry scan in any Indian language. In 15 seconds…" (DocuRec AI). "Is he playing you? (6M+ views, $1100 MRR)" (ReadHim).' },
      { t: 'all', x: 'Use the standard sections, and fill them with specifics.', d: 'Inspiration (statistic plus personal origin), What it does (the flow), How we built it (each tool named and what it does), Challenges (a real technical problem you solved), Accomplishments, What we learned, What\'s next (shows sustainability, which is scored at Empower and NEAR).', e: '' },
      { t: 'all', x: 'Make the first gallery image a hero shot of the product in use, captioned, and include an architecture diagram image.', d: 'Gemini 3, ADK and Cloud Run explicitly ask for an architecture diagram. Many winners captioned every image with what it shows.', e: '' },
      { t: 'all', x: 'Fill "Built with" with exact sponsor product names.', d: 'Judges and sponsor reviewers scan tags to shortlist for sponsor prizes.', e: '' },
      { t: 'all', x: 'Disclose the AI coding tools you used.', d: 'OneHacks required it. Knight Hacks rewards honesty about tools. Several RevenueCat and Kiro winners made "built with Claude Code / Kiro" part of their story.', e: 'Payout: "not one line of code written by hand".' },
      { t: 'all', x: 'One person creates the submission, adds every teammate, and ticks every eligible prize.', d: 'Knight Hacks: "Team members missing from the Devpost submission will not receive prizes." Sponsor prizes usually require selecting them on the form.', e: '' },
      { t: 'sponsor', x: 'Add the required write-up on how you used the sponsor tech.', d: 'Gemini 3 wanted about 200 words on which Gemini features were central. Kiro wanted how specs, hooks and steering were used. AWS Game Builder wanted how Q Developer saved time. Write it as its own section with that heading.', e: 'Visit Nepal won "Most Time Saved" by documenting exactly that.' },
    ]},
    { h: '5. Make the demo video (it\'s often 30–40% of the score)', when: 'Last 6 hours', items: [
      { t: 'all', x: '0:00–0:20: the problem, with a statistic or a personal story, and the named user.', d: 'Open with a scenario, not a logo or team intro.', e: 'Globot: "Friday 4:55 PM, the Red Sea crisis erupts, $50M in cargo…". LORE: "Auth service goes down. Two hours…".' },
      { t: 'all', x: '0:20–2:00: real screen recording of the core flow working, with no slides-only sections.', d: 'Show input, then the system acting, then the output. Zoom into the important UI. Show at least one hard case (an edge case, a refusal or an error handled).', e: 'Gemini Live criterion: "Does the video show the actual software working?"' },
      { t: 'all', x: '2:00–2:40: the architecture diagram and exactly where the sponsor tech sits, plus proof of deployment.', d: 'This earns the technical and sponsor-usage points from judges who never open your repo.', e: '' },
      { t: 'all', x: '2:40–3:00: impact or traction numbers and one concrete next step.', d: 'Users, revenue, time saved, accuracy, or cost compared with existing solutions.', e: 'Shepherd: about 1/20 of the cost of existing smart canes.' },
      { t: 'all', x: 'Keep it at 2:30–3:00 and never go over 3:00. Add burned-in captions.', d: 'The median transcribed winner video was 2:56. Judges may watch muted or at 1.5×, so captions help.', e: '' },
      { t: 'all', x: 'Upload early, set it public, and test the link logged out.', d: 'Bay2Bay checked the YouTube upload date. Private videos are a common silent failure.', e: '' },
      { t: 'inperson', x: 'Rehearse a 2-minute pitch plus 2 minutes of Q&A, and prepare 3 likely judge questions.', d: 'Cal Hacks: 2 minutes to pitch and 2 for questions at your table. Lead with the live demo, not slides.', e: '' },
    ]},
    { h: '6. Final hour', when: 'Submission day', items: [
      { t: 'all', x: 'Submit a complete draft 2–3 hours before the deadline, then keep editing.', d: 'Many hackathons allow edits after submit but lock some fields (Cal Hacks locked the table number). Devpost slows down near deadlines.', e: '' },
      { t: 'all', x: 'Open every link in an incognito window: demo, repo (public), video (public), TestFlight/Play/Horizon/subreddit link.', d: 'Check that the external-tester invite actually works for someone who isn\'t on the team.', e: '' },
      { t: 'all', x: 'Stop committing at the code freeze and keep the repo public afterwards.', d: 'Knight Hacks froze commits an hour after submissions. DeltaHacks reassigns prizes if the repo goes private.', e: '' },
      { t: 'deploy', x: 'Confirm the build is live in the required place (store, Horizon public world, Reddit app, Cloud Run URL) and set to public visibility.', d: 'Meta required worlds "Visible to the Public" and "Optimized for Web and Mobile". RevenueCat required release dates inside the window.', e: '' },
      { t: 'all', x: 'Post the project publicly (X, LinkedIn, Discord) and tag the sponsor.', d: 'Several hackathons scored or awarded this directly: Electroneum gave extra credit for community feedback, and Kiro and MeDo had Social Blitz prizes.', e: '' },
    ]},
  ];

  const root = document.getElementById('view-checklist');
  const KEY = 'hk-checklist-v1';
  let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch {} };
  let type = 'all';
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const id = (si, ii) => `${si}.${ii}`;
  const visible = it => type === 'all' || it.t === 'all' || it.t === type;

  function render() {
    const all = SECTIONS.flatMap((s, si) => s.items.map((it, ii) => ({ it, k: id(si, ii) }))).filter(o => visible(o.it));
    const n = all.filter(o => done[o.k]).length;
    root.innerHTML = `
      <div class="ck-head">
        <div>
          <h2>Next-hackathon checklist</h2>
          <p class="org">${all.length} concrete actions taken from what the 707 winners did and what the 145 rulebooks actually scored. Pick your hackathon type to add its specific items.</p>
        </div>
        <div class="ck-actions"><button class="ck-btn" id="ckPrint">Print</button><button class="ck-btn" id="ckReset">Reset</button></div>
      </div>
      <div class="seg ck-types" role="group" aria-label="Hackathon type">${Object.entries(TYPES).map(([k, v]) => `<button data-t="${k}" class="${k === type ? 'on' : ''}">${v}</button>`).join('')}</div>
      <div class="ck-progress" aria-label="Progress"><i style="width:${all.length ? Math.round(100 * n / all.length) : 0}%"></i></div>
      <p class="org">${n} of ${all.length} done</p>
      ${SECTIONS.map((s, si) => {
        const items = s.items.map((it, ii) => ({ it, k: id(si, ii) })).filter(o => visible(o.it));
        if (!items.length) return '';
        return `<section class="ck-sec"><h3>${esc(s.h)} <span class="org">${esc(s.when)}</span></h3>
          ${items.map(({ it, k }) => `<label class="ck-item ${done[k] ? 'done' : ''}">
            <input type="checkbox" data-k="${k}" ${done[k] ? 'checked' : ''}>
            <div><div class="ck-x">${esc(it.x)}${it.t !== 'all' ? ` <span class="chip">${TYPES[it.t]}</span>` : ''}</div>
            <div class="ck-d">${esc(it.d)}</div>
            ${it.e ? `<div class="ck-e"><b>Seen in winners:</b> ${esc(it.e)}</div>` : ''}</div>
          </label>`).join('')}</section>`;
      }).join('')}`;
  }
  root.addEventListener('change', e => { const k = e.target.dataset.k; if (!k) return; e.target.checked ? done[k] = 1 : delete done[k]; save(); render(); });
  root.addEventListener('click', e => {
    const t = e.target.closest('[data-t]'); if (t) { type = t.dataset.t; render(); return; }
    if (e.target.id === 'ckReset') { done = {}; save(); render(); }
    if (e.target.id === 'ckPrint') window.print();
  });
  render();
})();
