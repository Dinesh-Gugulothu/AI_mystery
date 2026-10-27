# Project implementation notes

The original project brief is `../spec md` and remains the product source of truth. This MVP implements a fictional, single-player mystery flow: create a case, inspect suspects and evidence, review the timeline, submit one accusation, then reveal the stored solution. User case history is kept in browser local storage for the guest session; case records persist in MongoDB when configured.

Optional scenario settings are supported by the form: mystery type, difficulty, suspect count, and investigation length. Input is bounded to 2,000 characters. The case dashboard tracks viewed suspects and evidence locally. No real case data, multiplayer, public sharing, or advanced generated media is included.
