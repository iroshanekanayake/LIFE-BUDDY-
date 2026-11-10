# LIFE-BUDDY Firebase Cloud — ඉක්මන් උපදෙස්

## මම සකස් කර ඇති දේ
- ඔයාගේ මුල් LIFE-BUDDY Features සහ Design තබාගෙන Firebase Login/Cloud Sync එකතු කර ඇත.
- Email Login සහ අලුත් Email Account සාදන බොත්තම් වෙන් කර ඇත.
- Google Login ඇත.
- Firebase Web Configuration එක ඔයා එවූ Screenshot එකෙන් ඇතුළත් කර ඇත.
- PDF/CSV/JSON බාගත කිරීම් සාමාන්‍ය Browser Download ක්‍රමයට සකස් කර ඇත.
- Firestore Security Rules ගොනුව ඇතුළත් කර ඇත.

## තවම කළ යුතු දේ
1. මේ ZIP එක Extract කරන්න.
2. එහි ඇති සියලුම ගොනු GitHub Pages Repository එකේ Root එකට Upload/Commit කරන්න.
3. Firebase Console → Firestore → Rules වෙත ගොස් `firestore.rules` ගොනුවේ අන්තර්ගතය Publish කරන්න.
4. GitHub Pages වෙබ් ලිපිනය නැවත විවෘත කර Refresh කරන්න.
5. මුල් වරට Login කරන විට මේ Browser එකේ තිබෙන දත්ත Cloud එක හිස් නම් Firebase වෙත Upload වේ.

**වැදගත්:** Rules Publish කරන තුරු Cloud Sync සම්පූර්ණයෙන් ක්‍රියාත්මක නොවේ. Rules සකස් කර අවසන් වනතුරු Offline/local data මකා දමන්න එපා. JSON Backup එකක් තබාගන්න.


## PDF / CSV බාගත කිරීම
- PDF, CSV සහ JSON බාගත කිරීම් සාමාන්‍ය Chrome/Safari browser download ක්‍රමයෙන් ක්‍රියා කරයි.
- Android Chrome හි Downloads folder එක පරීක්ෂා කරන්න.
- iPhone Safari හි PDF එක preview ලෙස විවෘත වුවහොත් Share → Save to Files තෝරන්න.
- අලුත් version එක deploy කළ පසු app එක refresh කරන්න; service-worker cache එක v5 ලෙස යාවත්කාලීන කර ඇත.
