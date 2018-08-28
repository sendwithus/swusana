# Swusana

Asana is great but some bits are annoying.  The list view is fixed at 1000px.  There is a lot of noise on the detail page with stories telling you about who moved a task where and these sometimes obsuce the actual human comments.
If you run meetings and take notes into Asana you get added as a follower to every task which then pollutes your inbox with many notifications.

This is a Tamper Monkey script to add buttons to the top nav bar of Asana that let you togle the following functionality: 
- Noise reduction and beautification: hide noise in the comments.
- Auto-unfollow: A blackout period button that auto-unfollows you from all tasks while it is activated.
- Image: Set a custom background image from a URL.
- Timer: Show a counter for a selected ticket (list view only) 

Currently only tested in Chrome.

## Installation

- Install tampermonkey: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
- Click on the below raw script URL that should auto install the script into Tamper Monkey: https://github.com/sendwithus/swusana/raw/master/swusana.user.js
- Reload your Asana page and you should see new buttons appear in the top nav bar.
