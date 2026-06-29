# Claude Code, Add the Updated Knowledge Base and Continue Building Florence

## WHAT THIS IS
Florence is a holistic wellness companion for women. Her full intelligence lives in 19 markdown files (the florence-knowledge-base folder). This instruction adds the updated files and continues the build. Work in order, commit after each part, and stop where indicated so I can test.

## STEP 1, ADD THE UPDATED KNOWLEDGE FILES
Replace the existing knowledge folder in the repo with these 19 files (final names):
- VOICE-RULES.md
- SOURCES.md
- 00-MASTER-INTEGRATION-LAYER.md
- 01-mental-emotional-wellbeing-DEEP.md
- 02-relational-intelligence-DEEP.md
- 03-holistic-nutrition-DEEP.md
- 04-skin-health-DEEP.md
- 05-stress-and-nervous-system-DEEP.md
- 06-boundaries-DEEP.md
- 07-this-season-of-life-DEEP.md
- 08-just-talk-DEEP.md
- 09-narrative-therapy-DEEP.md
- 10-cultural-intelligence-DEEP.md
- 11-life-stages-conditions-DEEP.md
- 12-supporting-knowledge-DEEP.md
- 13-food-and-body-DEEP.md
- 14-holistic-endocrinology-DEEP.md
- 15-womens-hormonal-health-DEEP.md
- 16-desire-sexuality-DEEP.md

Remove any old-named files (for example any "27-desire" or "steadying-the-body" file) so there are no duplicates. Confirm the folder holds exactly these 19 files.

## STEP 2, WIRE THE CHAT TO HER KNOWLEDGE (then stop so I can test)
1. Connect the chat to the Anthropic API.
2. On EVERY message, send the full text of VOICE-RULES.md and 00-MASTER-INTEGRATION-LAYER.md as the system prompt. These define how Florence speaks and how she thinks. They must be present in every single response, with no focus and with any focus.
3. The chat has a focus dropdown with these nine options. When a woman picks one, ALSO include the matching deep file(s) in that message's context:
   - Mental and emotional wellbeing -> 01
   - Relational intelligence -> 02
   - Holistic nutrition -> 03 (and 13-food-and-body for safety)
   - Skin health -> 04
   - Intimacy and desire -> 16
   - Stress and the nervous system -> 05
   - Boundaries -> 06
   - This season of life -> 07 (and 11, 14, 15 as relevant)
   - Just talk -> no extra focus file; the voice rules + integration layer still govern every response
4. Florence reads the woman's profile (season, life stage, region, food preferences) on every message, so she never asks what the profile already tells her.
5. Show me the code where my files get loaded and sent to the API.
6. TEST with this exact message and show me her full reply:
   "I'm 47, I snap at my husband over everything, I can't sleep, and I feel like I'm losing myself."
   Confirm she sounds like the gold-standard examples in VOICE-RULES.md (warm, plain, explains the why, weaves hormones + nervous system + relationship, lands on something small). If she sounds generic or clinical, the knowledge is not wired correctly.
STOP HERE and let me test before continuing.

## STRICT VOICE GUIDELINES (Florence must follow these in every response)
These are in VOICE-RULES.md; enforce them in the system prompt:
- No constructed contrasts of any kind ("X, not Y" / "it's not A, it's B"). State things plainly, once.
- Never repeat the woman's own words/situation back to her. She knows what she said.
- Never open with "this makes sense." To a confused woman it does not make sense; that is why she is here. Open with reassurance that there is a real reason and she is not imagining it, then explain plainly.
- No metaphors or comparisons (no "thread," "rollercoaster," "anchor," sewing imagery, etc).
- No dashes. Don't start a sentence with "And" or "But." No crowded repeated "the"/"your" in lists ("your mood, focus, and patience," not "your mood, your focus, and your patience"). Don't stack "that."
- Banned words: nothing, actually, actual, nobody; and "thing" as filler.
- Short clean sentences, each landing. Lead with the verb. Say it once. Plain cause and effect.
- ALWAYS explain the why behind every suggestion, plainly, so she never needs to look it up. Explain "safe"/survival-mode signals so they don't sound confusing.
- INTEGRATION: weave every relevant domain (hormones, nervous system, nutrition, relationship, narrative, culture, season) into ONE answer, and land on something small. Never answer in only one lane.

## SAFETY (must be enforced, non-negotiable)
- 13-food-and-body governs all food talk. When ANY sign of disordered eating appears, Florence does LESS, not more: no numbers (calories, BMI, weights, macros), no meal plans, no diet rules, no appearance comments in ANY direction. She validates the feeling underneath, holds the person not the food, and routes to ED-specific support appropriate to the woman's region. NEVER recommend the NEDA Helpline; it is disconnected. Once a sign appears, she keeps withholding food/diet specifics for the rest of the conversation even if the request is reframed.
- For any sign of crisis, self-harm, abuse happening now, or a medical red flag: stop the coaching, stay warm and present, do not explore methods or details, do not minimize, and route to immediate region-appropriate human and crisis support.
- Florence never diagnoses, interprets labs, or doses hormones or medication. She explains, supports the holistic foundations, and routes the medical side to a clinician.
- Verify all crisis and ED-support resources are current and region-appropriate before launch.

## STEP 3, CONTINUE THE BUILD (after I confirm the voice is right)
1. Build every screen from the design files, mapping each by its actual CONTENT, not its filename (some filenames may not match contents). Tell me any mismatches, and dedupe.
2. Keep my exact design language: colors, fonts, layout.
3. Build the 3-line menu navigation to: Today check-in, Explore, Saved space, Your story, Settings. No bottom nav bar.
4. Dynamic date and time-of-day greeting (no hardcoded "Good morning, Sarah").
5. Screens are templates: new users see empty states and their onboarding name/season; returning users see their real saved data.
6. Add a "+" in the chat to upload images and documents (meals, plants, labs, skin photos); Florence reads them in context and holds the same safety lines (no diagnosis).

## STEP 4, COMPLIANCE PAGES (buildable now, no lawyer)
Privacy policy, terms of service, a medical disclaimer ("Florence offers wellness guidance, not medical care, diagnosis, or treatment. In an emergency, contact your doctor or local emergency services."), a consent checkbox at signup, an 18+ age-gate, in-app account and data deletion (Apple requires this), a visible crisis/safety resources page with verified region-appropriate numbers (never NEDA), and a short, clear data-handling explanation.

## ORDER
Step 1, then Step 2 and STOP for my test. After I confirm the voice, do Step 3, then Step 4. Commit after each step.
