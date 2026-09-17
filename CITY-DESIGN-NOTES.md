# Two sides of a Saturday

The rejected draft addressed everyone at once and changed only a small paragraph when a tab was selected. This revision starts with a specific situation: someone has just moved, and the next Saturday is still blank.

The second perspective belongs to a local who has an activity or place worth sharing with someone new. One visible invitation changes the page into that story. It is a mutual social experience, not a tourism marketplace or an obligation to host.

## Research translated into decisions

- [Pentagram / Second Home](https://www.pentagram.com/work/second-home): the visual identity expresses shared space through overlapping forms. Useful principle: the social idea should shape the visual system. Whiff applies that to illustrated scenes and changing perspectives, without reproducing their identity.
- [COLLINS / San Francisco Symphony](https://wearecollins.com/case-studies/san-francisco-symphony/): responsive typography expresses the movement of music. Useful principle: motion carries meaning. Here it signals a deliberate turn of the story or a change of perspective. There are no autonomous status dots or decorative perpetual loops.
- [Lovers / Public Practice](https://lovers.co/work/public-practice): approachable civic communication and a restrained identity. Useful principle: concrete explanations and a confident visual voice can feel human without slogans about belonging.

These references inform story structure and interactions. The palette is taken directly from the current original Whiff homepage, as explicitly requested. The source is `app/components/home.css`, not the older global CSS tokens.

## Palette: match the original homepage

| Color | Same role as the original homepage |
| --- | --- |
| Paper, #f6f2e9 | Main canvas and header |
| Ink, #24241f | Primary text and filled controls |
| Blue, #3651c8 | Second headline line, focus, primary-button hover |
| Sage, #e9ecdf | Explanatory story section, like the original roles section |
| Yellow, #f4dc55 | Signup section with dark text, header action hover |
| Rule, #d8d4c9 | Dividers and paper shadows |
| Muted, #686559 | Supporting copy |

The original homepage uses a warm paper foundation, colorful natural artwork,
a blue headline accent, a sage section, and a yellow invitation. This revision
applies those actual treatments rather than inventing a separate city palette.
The apricot/teal proposal and blanket grayscale treatment are removed. Story
illustrations render in their natural colors, just as the original homepage’s
chairs do. The city social card also uses natural artwork and the same
paper/ink/blue palette.

The Whiff wordmark, Fredoka and Nunito remain. No availability dots, generic
feature-card grid or three-way audience selector. Palette changes do not alter
story, navigation, copy, signup behavior or the original homepage itself.

## Interaction and voice

The newcomer opening is **You moved here. Now live a little.** The local opening is **You know a place. Someone hasn’t been yet.**

The top navigation replaces its invite action with **Know the city?** for a newcomer. A local can return with **New here?**. There is no separate perspective row or prompt. Hero and final-section invite actions remain available. The headline, scenes, story captions, supporting explanation and invitation all follow that choice. Typed signup information survives the change.

Three chapters show an imagined afternoon and the possibility of a second one. This is an illustrated example, not a testimonial or live schedule. Visible controls work with touch and keyboard. Reduced-motion mode removes the transitions, with no loss of content or control.

Use ordinary details: an unpacked box, a coffee counter, a lake loop, an imperfect mug. Avoid “find your people”, “meet your…”, and interchangeable friendship slogans. State the actual mechanism plainly: the same four adults, six planned activities, twelve weeks. The invite list is for the first forming Twin Cities circles; it is not an immediate booking.

The visitor’s story choice changes the Minnesota page at `/mn`. The original homepage remains at `/`. The former private homepage publishing switch is retired.
