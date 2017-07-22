JavaScript GameBoy Color Emulator for WebVR
===========================================

**Copyright (C) 2010 - 2016 Grant Galitz**

**WebVR components are Copyright (C) 2017 Michael Andrew and their respective authors**

A GameBoy Color emulator that utilizes HTML5 canvas and JavaScript audio APIs to provide a full emulation of the console.

Controls
--------

* A = z
* B = x
* START = Enter
* Select = Shift
* Left = J
* Up = I
* Right = L
* Down = K

Known browsers to work well in:
-------------------------------

* Firefox 4-27 (Windows 7, Windows Vista, Mac OS X)
* Google Chrome 18+
* Safari 5.1.5+

Browsers that suck at performance or fail to run the code correctly:
--------------------------------------------------------------------

* Firefox 4+ (*nix versions of Firefox have audio lockup bugs) - Retest this
* Firefox 28+ (Web Audio API creates 500 ms or greater latency, forced by Firefox)
* Opera (Crashes + Slow + Graphics Glitches) - Retest this
* Safari 5.1.X (Below 5.1.5) (Slow or crashes)
* IE 1-8 (Cannot run)
* IE 9-10 (Slow, No native audio support (Requires flash bridge in the audio lib))
* IE 11 (No native audio support (Requires flash bridge in the audio lib))
* Firefox 1-3.6 (Slow)
* ALL VERSIONS OF MOBILE SAFARI AND OPERA (Stop pestering me, iOS just **CAN'T** run this well.)

CPU instruction set accuracy test results (Blargg's cpu_instrs.gb test ROM):
-----------------------------------------------------

* **GameBoy Online:**

	![GameBoy Online (This emulator)](http://i.imgur.com/ivs7F.png "Passes")
* **Visual Boy Advance 1.7.2:**

	![Visual Boy Advance 1.7.2](http://i.imgur.com/NYnYu.png "Fails")
* **KiGB:**

	![KiGB](http://i.imgur.com/eYHDH.png "Fails")
* **Gambatte:**

	![Gambatte](http://i.imgur.com/vGHFz.png "Passes")

ROM Licences
------------

## Geometrix ##

This game is licensed under the GPL v3 license. You may have received the source code of this game along with the ROM
file. If not, the source code is freely available at the following address:

https://github.com/AntonioND/geometrix