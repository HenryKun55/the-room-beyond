/**
 * Simple dialogue content for object descriptions
 * Provides single-line descriptions for each interactive object
 */
export class SimpleDialogueContent {
  
  private static descriptions: Map<string, string> = new Map([
    ['phone', "My phone sits silent on the desk, its black screen reflecting nothing. I haven't touched it in hours - the constant buzzing and notifications felt overwhelming today."],
    
    ['laptop', "My laptop waits patiently, closed and silver. Behind that screen are emails I haven't answered, deadlines I'm avoiding, and a world that feels too demanding right now."],
    
    ['vr_headset', "The VR headset offers escape to anywhere but here. Virtual worlds where I can be anyone, go anywhere - where anxiety doesn't follow me. But when I take it off, I'm still in this room."],
    
    ['alarm_clock', "The alarm clock's red digits stare back at me: 3:47. AM or PM? Time has lost meaning when every day blends into the next. I should set an alarm, but for what?"],
    
    ['desk', "My desk - command center of my isolated world. Scattered papers, empty coffee cups, unfinished projects. This is where I'm most productive and most trapped."],
    
    ['bed', "My bed has become refuge and prison both. How many hours have I spent here, not sleeping, just existing? Hiding under covers from a world that feels too bright, too loud."],
    
    ['chair', "This chair has become my throne and my cage. I sit here for hours, paralyzed by choices, overwhelmed by options, frozen by the fear of making any decision at all."]
  ]);
  
  /**
   * Get description for a specific object
   * @param objectId - The ID of the object to describe
   * @returns Description string or null if object not found
   */
  static getObjectDescription(objectId: string): string | null {
    return this.descriptions.get(objectId) || null;
  }
}