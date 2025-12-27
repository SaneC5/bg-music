Background Music Website 🎶

---------------------------

Overview:-

The Background Music Website is a web-based music player designed for an immersive listening experience with an animated equalizer visual. It allows users to enjoy soothing background music with a visually dynamic equalizer that reacts to the music in real-time.

This project demonstrates the use of:

Audio control (play, pause, next, previous)

Volume control and theme toggling

Real-time audio visualization using the Web Audio API

User-friendly interface with interactive elements like buttons and keyboard shortcuts

---------------------------

Features:-

Autoplay Handling

Displays a message if autoplay is blocked by the browser and provides a button to start the music manually.

Interactive Playlist Controls

Navigate through a playlist with "Previous" and "Next" buttons.

Play or pause music with a toggle button.

Real-Time Music Equalizer

Animated equalizer that reacts to the frequency data of the currently playing music.

Color-changing bars based on music intensity, creating an engaging visual experience.

Volume Control

Adjust music volume using a range slider, with real-time updates.

Theme Toggle

Switch between dark and light modes to personalize the UI.

Keyboard Shortcuts

Spacebar to toggle play/pause.

Arrow keys for volume control and song navigation.

---------------------------

Game Flow:-

Autoplay Blocked Notification:
When the page loads, a message will prompt the user to start the music manually if autoplay is blocked by their browser.

Music Playback:
The first song starts playing automatically, and users can toggle between songs using the "Next" and "Previous" buttons.

Equalizer Animation:
As the music plays, the equalizer visualization updates in real time, with bars that fluctuate based on frequency data.

Volume Adjustment:
Users can adjust the volume using the slider, or use the Arrow Up/Down keys for quick control.

Night/Day Mode Toggle:
Click the 🌙/🌞 button to switch between dark and light themes, adjusting the page's background and text colors accordingly.

Keyboard Shortcuts for Control:

Spacebar: Play/Pause the music

Arrow Left: Go to the previous song

Arrow Right: Go to the next song

Arrow Up/Down: Adjust volume

---------------------------

Technologies:-

HTML5: Used for structure and basic layout.

CSS3: For styling the website with modern animations and a responsive design.

JavaScript: Handles the functionality, including audio control, song switching, equalizer animation, and event handling.

Web Audio API: Used for audio visualization and real-time frequency analysis to create the equalizer effect.

---------------------------

Code Structure:-

HTML:

Audio Player: Contains the audio element for music playback.

Theme Toggle Button: Allows users to switch between day and night themes.

Song Title Display: Shows the current song being played.

Playlist Controls: Includes "Previous", "Next", and volume controls.

Equalizer Visualization: A canvas element used to render the frequency bars.

CSS:

Basic Styling: Ensures a clean and visually appealing layout.

Animations: Includes glowing text and smooth transitions for UI elements.

Equalizer Styling: Styles for the equalizer bars, including a color gradient that changes based on music intensity.

JavaScript:

Playlist Logic: Manages switching between songs and playing/pause actions.

Volume Control: Handles user input to adjust the music volume.

Equalizer Visualization: Uses the Web Audio API to analyze the audio data and draw the equalizer in real time.

Keyboard Shortcuts: Listens for key events to control the player.

---------------------------

Possible Enhancements:-

Add More Songs: Expand the playlist by adding more songs to the array.

Song Metadata: Display song artist, album name, and duration for each track.

Shuffle Play: Add a shuffle button to randomize song playback order.

Mobile Responsiveness: Ensure the design looks great on mobile devices by adding responsive CSS media queries.

Playback Progress: Implement a progress bar to show the current position in the song.

---------------------------

Final Notes:-

This Background Music Website is designed to offer both musical enjoyment and a visually dynamic experience. The interactive equalizer adds an immersive touch, and the playlist and theme toggles enhance user control. Feel free to expand or modify the project to suit your personal or professional needs!