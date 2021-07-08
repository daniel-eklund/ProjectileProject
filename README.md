# ProjectileProject

This program is a port of a Ti-84+ program I previously had made.
The purpose of building this project was to ultimately create a
web ran ti-84+ simulator, with another project that could parse
ti-84 basic programs and output a format that could be loaded into 
the simulator. Therefore most of the functions were written to 
"copy" Ti-Basic syntax to allow a seamless transfer. 

Currently it runs in pure Javascript and is a state machine that
draws Ti-84+ font and pixels onto a Javascript canvas. 

**NOTE: This is the original calulator readme from 2013**
**Projectile Project** 
Table of contents:  
 	1 Requirements  
 	2 Installation  
 	3 Story  
 	4 Gameplay & Keys  
 	5 Game Modes  
 	6 Contact  
 	7 Notes  
 	8 Planned additions  
    
 	(1) Requirements  
 		-Ti-84+ or Ti-84+se (hopefully with Doors CS installed, but not required)  
 		-~10,000 bytes in Ram  
 		-A spare Calculator (for small calculations)  
 		-Paper and pencil (for scratch work)  
      
 	(2) Installation  
		-Send all programs to Calculator using linking software of choice  
		-Send the following programs into RAM  
			-prgmPROJPROJ  
			-prgmGRAVLOOP  
			-prgmSHOT  
			-prgmTXTROUT  
		-Main program is prgmPROJPROJ, run this for gameplay  
      
	(3) Story  
		You have been summoned by the government to undertake a series of missions due  
		to several attacks from the SSR. A seasoned veteran of war, Professor Zelda,  
		is now your guide to "train" your brain into commission in these days of peril.  
		You start out learning the basics of Gravity and lead on to concepts of Projectile  
		motion, and this is where your training begins...  
		  
	(4) Gameplay & Keys  
		There are several in game menus and this will explain each.  
		Main:  
			-Move up or down using up and down arrow keys respectively  
			-Select your choice by pressing [2ND]  
			-CONTINUE: this continues the save game  
			-NEW GAME: gives the choice to reset saved game  
			-SELECT LEVEL: user can choose any previous levels to re-play  
			-QUIT: Quits to home screen  
		In Game:  
			-Pregame text:  
				Pressing any key advances the text to the next "slide"  
			[Y=] (Equ): View the two equations given  
			[WINDOW] (Txt): Allows the user to replay the pre-game text for additional level help  
			[ZOOM] (Specs): Shows addtional information about the level; distance to target,  
				gravity, and locked velocity or angle values  
			[TRACE] (Help): Gives additional hints to help the user finish the level  
			[GRAPH] (Quit): Quits the game  
			[2ND] (Fire): Fires the projectile at the given angle and velocity  
			[UP.ARROW] (Angle): Increases the angle  
			[DOWN.ARROW] (Angle): Decreases the angle  
			[LEFT.ARROW] (Vel):  Decreases velocity  
			[RIGHT.ARROW] (Vel): Increases velocity  
        
	(5) Game Modes  
		-There is two modes: Story and Replay  
			-Story:  
				-By pressing continue it allows you to play the storyline and advance through  
				the included levels  
				-After beating all 10 levels it advances to freeplay mode  
					-Freeplay mode are all randomly generated levels. If it seems impossible  
					to solve for the correct variable, quit the game and go back into it.   
			-Replay:  
				-Replay allows you to select any previous levels (that you have already beaten)  
				and replay them. Note that it only gives you one try to complete the level  
				then it returns to main menu  
