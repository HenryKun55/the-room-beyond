import { DialogueNode } from '../types/interfaces';

/**
 * Rich dialogue content for The Room Beyond
 * Explores themes of agoraphobia, digital dependency, and isolation
 */
export class DialogueContent {
  
  /**
   * Phone dialogue tree - Digital dependency and social anxiety
   */
  static getPhoneDialogue(): Map<string, DialogueNode> {
    const nodes = new Map<string, DialogueNode>();
    
    nodes.set('phone_start', {
      id: 'phone_start',
      speaker: 'Inner Voice',
      text: "My phone... it's been dead for hours. I should charge it, but... do I really want to? The constant notifications, the endless scrolling, the pressure to respond to everyone.",
      choices: [
        { text: "I need to stay connected", nextNodeId: 'phone_connected' },
        { text: "Maybe the silence is peaceful", nextNodeId: 'phone_peaceful' },
        { text: "What if someone needs me?", nextNodeId: 'phone_anxiety' }
      ]
    });
    
    nodes.set('phone_connected', {
      id: 'phone_connected',
      speaker: 'Inner Voice',
      text: "But what if I miss something important? What if work calls? What if there's an emergency? The rational part of me knows I'm probably fine, but the anxiety... it never stops whispering.",
      choices: [
        { text: "Check for missed calls", nextId: 'phone_missed' },
        { text: "The anxiety is getting worse", nextId: 'phone_anxiety_growing' }
      ]
    });
    
    nodes.set('phone_peaceful', {
      id: 'phone_peaceful',
      speaker: 'Inner Voice',
      text: "For the first time in months, I can hear my own thoughts clearly. No buzzing, no chirping, no digital demands. Is this what peace feels like? Or is this what isolation feels like?",
      choices: [
        { text: "I miss the connection", nextId: 'phone_miss_connection' },
        { text: "This silence is exactly what I need", nextId: 'phone_embrace_silence' }
      ]
    });
    
    nodes.set('phone_anxiety', {
      id: 'phone_anxiety',
      speaker: 'Inner Voice',
      text: "The 'what-ifs' spiral endlessly. Mom could have called. Work might need me. Friends might think I'm ignoring them. But when was the last time anyone actually NEEDED me for something urgent?",
      choices: [
        { text: "I'm probably overreacting", nextId: 'phone_overreacting' },
        { text: "I can't take this uncertainty", nextId: 'phone_uncertainty' }
      ]
    });
    
    nodes.set('phone_missed', {
      id: 'phone_missed',
      speaker: 'Inner Voice',
      text: "I press the power button. Nothing. Dead battery, dead screen, dead connection to the world. Somehow, that feels appropriate.",
      choices: []
    });
    
    nodes.set('phone_anxiety_growing', {
      id: 'phone_anxiety_growing',
      speaker: 'Inner Voice',
      text: "Every minute without my phone feels like an hour. How did I become so dependent on this little rectangle of glass and metal? When did staying connected become more important than being present?",
      choices: []
    });
    
    nodes.set('phone_miss_connection', {
      id: 'phone_miss_connection',
      speaker: 'Inner Voice',
      text: "But the silence feels wrong too. I'm so used to the constant stream of information, validation, distraction. Without it, I'm left alone with thoughts I've been avoiding.",
      choices: []
    });
    
    nodes.set('phone_embrace_silence', {
      id: 'phone_embrace_silence',
      speaker: 'Inner Voice',
      text: "Maybe this forced disconnection is a gift. Maybe I can finally face the thoughts I've been drowning out with notifications and endless scrolling.",
      choices: []
    });
    
    nodes.set('phone_overreacting', {
      id: 'phone_overreacting',
      speaker: 'Inner Voice',
      text: "I know I'm catastrophizing. But knowing that doesn't make the feeling go away. The mind has its own logic, and right now, that logic says 'danger everywhere.'",
      choices: []
    });
    
    nodes.set('phone_uncertainty', {
      id: 'phone_uncertainty',
      speaker: 'Inner Voice',
      text: "The not-knowing is worse than any bad news could be. My imagination fills the void with worst-case scenarios. This is how anxiety works - it feeds on uncertainty.",
      choices: []
    });
    
    return nodes;
  }
  
  /**
   * Laptop dialogue tree - Work anxiety and digital escape
   */
  static getLaptopDialogue(): Map<string, DialogueNode> {
    const nodes = new Map<string, DialogueNode>();
    
    nodes.set('laptop_start', {
      id: 'laptop_start',
      speaker: 'Inner Voice',
      text: "My laptop sits closed, a silver gateway to a world I'm both desperate to enter and terrified to face. Work emails waiting. Deadlines looming. The digital tether that keeps me employed but trapped.",
      choices: [
        { text: "I should check my emails", nextId: 'laptop_emails' },
        { text: "Maybe I can work from here forever", nextId: 'laptop_remote_work' },
        { text: "Close the lid and walk away", nextId: 'laptop_avoid' }
      ]
    });
    
    nodes.set('laptop_emails', {
      id: 'laptop_emails',
      speaker: 'Inner Voice',
      text: "492 unread emails. The number makes my chest tight. Each one a tiny demand, a small crisis, a micro-emergency that's probably not an emergency at all. But what if one of them is?",
      choices: [
        { text: "Start reading from the top", nextId: 'laptop_overwhelmed' },
        { text: "Mark all as read", nextId: 'laptop_ignore' },
        { text: "Search for anything urgent", nextId: 'laptop_urgent' }
      ]
    });
    
    nodes.set('laptop_remote_work', {
      id: 'laptop_remote_work',
      speaker: 'Inner Voice',
      text: "Working from home seemed like a dream once. No commute, no office politics, no forced small talk. But now it feels like a cage. The walls of this room have become the boundaries of my entire world.",
      choices: [
        { text: "This isn't sustainable", nextId: 'laptop_unsustainable' },
        { text: "I'm safe here", nextId: 'laptop_safe_space' }
      ]
    });
    
    nodes.set('laptop_avoid', {
      id: 'laptop_avoid',
      speaker: 'Inner Voice',
      text: "I run my finger along the smooth metal edge. Such a simple action would connect me to everything I'm avoiding. But I can't. Not today. Maybe not tomorrow either.",
      choices: []
    });
    
    nodes.set('laptop_overwhelmed', {
      id: 'laptop_overwhelmed',
      speaker: 'Inner Voice',
      text: "Subject lines blur together: 'URGENT', 'Action Required', 'Quick Question'. Nothing is quick anymore. Everything feels urgent. Everything feels impossible.",
      choices: []
    });
    
    nodes.set('laptop_ignore', {
      id: 'laptop_ignore',
      speaker: 'Inner Voice',
      text: "492 becomes 0 with a single click. The anxiety doesn't disappear though - it just transforms. Now I'm anxious about what I might have missed.",
      choices: []
    });
    
    nodes.set('laptop_urgent', {
      id: 'laptop_urgent',
      speaker: 'Inner Voice',
      text: "I scan for keywords: 'deadline', 'emergency', 'urgent'. Most of it is noise. The truly important things rarely announce themselves with exclamation points.",
      choices: []
    });
    
    nodes.set('laptop_unsustainable', {
      id: 'laptop_unsustainable',
      speaker: 'Inner Voice',
      text: "I know this can't continue. Hiding in my room, avoiding the world, letting anxiety make all my decisions. But knowing something and changing it are different things entirely.",
      choices: []
    });
    
    nodes.set('laptop_safe_space', {
      id: 'laptop_safe_space',
      speaker: 'Inner Voice',
      text: "Here, I control everything. The lighting, the temperature, the sounds. No unexpected encounters, no social landmines. But safety at what cost?",
      choices: []
    });
    
    return nodes;
  }
  
  /**
   * VR Headset dialogue tree - Virtual reality as escape mechanism
   */
  static getVRHeadsetDialogue(): Map<string, DialogueNode> {
    const nodes = new Map<string, DialogueNode>();
    
    nodes.set('vr_headset_start', {
      id: 'vr_headset_start',
      speaker: 'Inner Voice',
      text: "The VR headset promises escape to anywhere but here. Virtual worlds where I can be anyone, go anywhere, do anything. Where the limitations of my anxious mind don't apply.",
      choices: [
        { text: "Put on the headset", nextId: 'vr_escape' },
        { text: "Virtual isn't real", nextId: 'vr_reality_check' },
        { text: "Maybe I can practice being social", nextId: 'vr_social_practice' }
      ]
    });
    
    nodes.set('vr_escape', {
      id: 'vr_escape',
      speaker: 'Inner Voice',
      text: "In virtual reality, I can stand on mountaintops without fear of falling. I can speak to strangers without stuttering. I can explore vast worlds without leaving this room. But when I take it off...",
      choices: [
        { text: "The real world feels smaller", nextId: 'vr_diminished_reality' },
        { text: "I want to go back in", nextId: 'vr_addiction' }
      ]
    });
    
    nodes.set('vr_reality_check', {
      id: 'vr_reality_check',
      speaker: 'Inner Voice',
      text: "These virtual achievements, virtual friendships, virtual experiences - what do they mean if they're not real? But then again, what makes something 'real'? My emotions feel real when I'm in there.",
      choices: [
        { text: "Feelings matter more than physics", nextId: 'vr_emotional_reality' },
        { text: "I need to engage with the actual world", nextId: 'vr_actual_world' }
      ]
    });
    
    nodes.set('vr_social_practice', {
      id: 'vr_social_practice',
      speaker: 'Inner Voice',
      text: "Maybe I can use this to prepare. Practice conversations, exposure therapy in a safe environment. Learn to be social again before facing the real world.",
      choices: [
        { text: "This could be therapeutic", nextId: 'vr_therapy' },
        { text: "Or it could become another avoidance", nextId: 'vr_avoidance' }
      ]
    });
    
    nodes.set('vr_diminished_reality', {
      id: 'vr_diminished_reality',
      speaker: 'Inner Voice',
      text: "After flying through fantastical landscapes, walking to the kitchen feels mundane. After virtual adventures, my real life feels impossibly small.",
      choices: []
    });
    
    nodes.set('vr_addiction', {
      id: 'vr_addiction',
      speaker: 'Inner Voice',
      text: "Just five more minutes. Just one more quest. Just one more world to explore. Anything to avoid coming back to this room, this life, this anxious mind.",
      choices: []
    });
    
    nodes.set('vr_emotional_reality', {
      id: 'vr_emotional_reality',
      speaker: 'Inner Voice',
      text: "The joy I feel in virtual worlds, the sense of accomplishment, the connections - they feel genuine. Maybe the medium doesn't matter if the experience is meaningful.",
      choices: []
    });
    
    nodes.set('vr_actual_world', {
      id: 'vr_actual_world',
      speaker: 'Inner Voice',
      text: "But there's something missing in virtual interactions. The weight of consequences, the unpredictability, the raw messiness of real human connection.",
      choices: []
    });
    
    nodes.set('vr_therapy', {
      id: 'vr_therapy',
      speaker: 'Inner Voice',
      text: "Controlled exposure to what I fear. Practice without judgment. A bridge between hiding and facing the world. This could actually help.",
      choices: []
    });
    
    nodes.set('vr_avoidance', {
      id: 'vr_avoidance',
      speaker: 'Inner Voice',
      text: "Or I could convince myself I'm 'practicing' while actually just hiding in a more sophisticated way. Self-deception with better graphics.",
      choices: []
    });
    
    return nodes;
  }
  
  /**
   * Alarm Clock dialogue tree - Time, routine, and the passage of days
   */
  static getAlarmClockDialogue(): Map<string, DialogueNode> {
    const nodes = new Map<string, DialogueNode>();
    
    nodes.set('alarm_clock_start', {
      id: 'alarm_clock_start',
      speaker: 'Inner Voice',
      text: "3:47 PM. Or is it AM? Time has lost meaning when every day blends into the next. The red digits mock me - time passes whether I participate in life or not.",
      choices: [
        { text: "When did I last have a schedule?", nextId: 'alarm_schedule' },
        { text: "Time moves differently when you're anxious", nextId: 'alarm_anxiety_time' },
        { text: "I should set an alarm for tomorrow", nextId: 'alarm_tomorrow' }
      ]
    });
    
    nodes.set('alarm_schedule', {
      id: 'alarm_schedule',
      speaker: 'Inner Voice',
      text: "Before the world closed, I had structure. Wake up, shower, commute, work, repeat. It felt constraining then. Now I'd give anything for that external framework to organize my days.",
      choices: [
        { text: "Structure was actually comforting", nextId: 'alarm_structure_comfort' },
        { text: "I can create my own routine", nextId: 'alarm_self_structure' }
      ]
    });
    
    nodes.set('alarm_anxiety_time', {
      id: 'alarm_anxiety_time',
      speaker: 'Inner Voice',
      text: "Anxiety distorts time. Minutes stretch into hours when you're panicking. Days compress into nothing when you're avoiding. I've lost weeks to this haze.",
      choices: [
        { text: "I need to reclaim my time", nextId: 'alarm_reclaim_time' },
        { text: "Maybe time doesn't matter", nextId: 'alarm_time_meaningless' }
      ]
    });
    
    nodes.set('alarm_tomorrow', {
      id: 'alarm_tomorrow',
      speaker: 'Inner Voice',
      text: "Tomorrow I'll wake up at a reasonable hour. Tomorrow I'll be productive. Tomorrow I'll take a step outside. Tomorrow is always tomorrow.",
      choices: [
        { text: "I mean it this time", nextId: 'alarm_commitment' },
        { text: "I've made this promise before", nextId: 'alarm_broken_promises' }
      ]
    });
    
    nodes.set('alarm_structure_comfort', {
      id: 'alarm_structure_comfort',
      speaker: 'Inner Voice',
      text: "External demands meant I didn't have to negotiate with my anxiety every morning. Someone else decided when I needed to be where. Now every decision is a battle.",
      choices: []
    });
    
    nodes.set('alarm_self_structure', {
      id: 'alarm_self_structure',
      speaker: 'Inner Voice',
      text: "I can be my own boss, set my own schedule, create my own meaning. But self-discipline is harder when anxiety is the loudest voice in the room.",
      choices: []
    });
    
    nodes.set('alarm_reclaim_time', {
      id: 'alarm_reclaim_time',
      speaker: 'Inner Voice',
      text: "Each moment I let anxiety choose my actions is a moment stolen from the life I want to live. Time to take it back, one decision at a time.",
      choices: []
    });
    
    nodes.set('alarm_time_meaningless', {
      id: 'alarm_time_meaningless',
      speaker: 'Inner Voice',
      text: "Clock time, calendar time - arbitrary human constructs. Maybe I'm operating on emotional time now. Healing time. Recovery time.",
      choices: []
    });
    
    nodes.set('alarm_commitment', {
      id: 'alarm_commitment',
      speaker: 'Inner Voice',
      text: "This time feels different. The intention is clearer, the motivation stronger. Or maybe that's what I tell myself every time.",
      choices: []
    });
    
    nodes.set('alarm_broken_promises', {
      id: 'alarm_broken_promises',
      speaker: 'Inner Voice',
      text: "How many alarms have I dismissed? How many 'tomorrow I'll change' promises have I broken to myself? Hope and disappointment, cycle repeat.",
      choices: []
    });
    
    return nodes;
  }
  
  /**
   * Desk dialogue tree - Workspace and productivity anxiety
   */
  static getDeskDialogue(): Map<string, DialogueNode> {
    const nodes = new Map<string, DialogueNode>();
    
    nodes.set('desk_start', {
      id: 'desk_start',
      speaker: 'Inner Voice',
      text: "My desk - command center of my isolated world. Scattered papers, empty coffee cups, the detritus of days spent avoiding the outside. This is where I'm most productive and most trapped.",
      choices: [
        { text: "Look at the unfinished projects", nextId: 'desk_projects' },
        { text: "This used to inspire me", nextId: 'desk_inspiration' },
        { text: "I need to organize this chaos", nextId: 'desk_organize' }
      ]
    });
    
    nodes.set('desk_projects', {
      id: 'desk_projects',
      speaker: 'Inner Voice',
      text: "Half-finished sketches, abandoned writing, courses I started but never completed. Each one represents a moment when ambition met anxiety and lost.",
      choices: [
        { text: "I can still finish these", nextId: 'desk_finish' },
        { text: "Why do I start things I can't complete?", nextId: 'desk_pattern' }
      ]
    });
    
    nodes.set('desk_inspiration', {
      id: 'desk_inspiration',
      speaker: 'Inner Voice',
      text: "This desk once buzzed with creativity and focus. Ideas flowed, projects completed, goals achieved. What changed? When did this become a monument to avoidance?",
      choices: [
        { text: "I can reclaim this space", nextId: 'desk_reclaim' },
        { text: "Those days are gone", nextId: 'desk_nostalgia' }
      ]
    });
    
    nodes.set('desk_organize', {
      id: 'desk_organize',
      speaker: 'Inner Voice',
      text: "Maybe if I clean this space, organize these papers, create order from chaos, I can create mental clarity too. Or maybe I'm just procrastinating again.",
      choices: [
        { text: "External order creates internal calm", nextId: 'desk_external_order' },
        { text: "This is just another avoidance tactic", nextId: 'desk_avoidance' }
      ]
    });
    
    nodes.set('desk_finish', {
      id: 'desk_finish',
      speaker: 'Inner Voice',
      text: "Each unfinished project is a conversation I walked away from. Maybe I can pick up where I left off, but will the anxiety let me?",
      choices: []
    });
    
    nodes.set('desk_pattern', {
      id: 'desk_pattern',
      speaker: 'Inner Voice',
      text: "The pattern is clear: enthusiasm, progress, first obstacle, anxiety spike, abandonment. Recognizing the pattern is the first step to breaking it.",
      choices: []
    });
    
    nodes.set('desk_reclaim', {
      id: 'desk_reclaim',
      speaker: 'Inner Voice',
      text: "This desk is mine. This space is mine. These dreams are mine. Anxiety may have squatted here, but it doesn't have permanent residency.",
      choices: []
    });
    
    nodes.set('desk_nostalgia', {
      id: 'desk_nostalgia',
      speaker: 'Inner Voice',
      text: "Grieving for the person I used to be, the productivity I used to have, the confidence that once filled this space. But grief can be the first step toward rebuilding.",
      choices: []
    });
    
    nodes.set('desk_external_order', {
      id: 'desk_external_order',
      speaker: 'Inner Voice',
      text: "There's truth in that. When everything around me is chaos, my mind follows suit. Creating order here might create space for clarity.",
      choices: []
    });
    
    nodes.set('desk_avoidance', {
      id: 'desk_avoidance',
      speaker: 'Inner Voice',
      text: "Another way to feel busy without being productive, organized without being purposeful. But even avoidance can sometimes lead to useful action.",
      choices: []
    });
    
    return nodes;
  }
  
  /**
   * Bed dialogue tree - Sleep, rest, and the comfort of withdrawal
   */
  static getBedDialogue(): Map<string, DialogueNode> {
    const nodes = new Map<string, DialogueNode>();
    
    nodes.set('bed_start', {
      id: 'bed_start',
      speaker: 'Inner Voice',
      text: "My bed - refuge and prison, comfort and trap. How many hours have I spent here, not sleeping, just existing? Hiding under covers from a world that feels too bright, too loud, too much.",
      choices: [
        { text: "I sleep too much", nextId: 'bed_oversleep' },
        { text: "I can't sleep at all", nextId: 'bed_insomnia' },
        { text: "This is my safe space", nextId: 'bed_safe' }
      ]
    });
    
    nodes.set('bed_oversleep', {
      id: 'bed_oversleep',
      speaker: 'Inner Voice',
      text: "Twelve hours, fourteen hours, sixteen hours. Sleep becomes another form of avoidance. If I'm unconscious, I don't have to face anything.",
      choices: [
        { text: "Sleep is healing", nextId: 'bed_healing' },
        { text: "I'm wasting my life", nextId: 'bed_wasting' }
      ]
    });
    
    nodes.set('bed_insomnia', {
      id: 'bed_insomnia',
      speaker: 'Inner Voice',
      text: "3 AM thoughts circle like vultures. Every worry amplified, every fear multiplied. The bed becomes a torture device when anxiety won't let consciousness rest.",
      choices: [
        { text: "My mind won't stop racing", nextId: 'bed_racing_mind' },
        { text: "Darkness makes everything worse", nextId: 'bed_darkness' }
      ]
    });
    
    nodes.set('bed_safe', {
      id: 'bed_safe',
      speaker: 'Inner Voice',
      text: "Under these covers, I make the rules. No one can reach me, judge me, demand things from me. But safety can become a cage if I never leave it.",
      choices: [
        { text: "I need this sanctuary", nextId: 'bed_sanctuary' },
        { text: "This isn't living", nextId: 'bed_not_living' }
      ]
    });
    
    nodes.set('bed_healing', {
      id: 'bed_healing',
      speaker: 'Inner Voice',
      text: "Maybe my body knows what it needs. Maybe this rest is necessary, a chrysalis stage before transformation. Or maybe that's just what I tell myself.",
      choices: []
    });
    
    nodes.set('bed_wasting', {
      id: 'bed_wasting',
      speaker: 'Inner Voice',
      text: "Days disappear into dreams and half-dreams. Life is happening somewhere else while I hide in unconsciousness. But consciousness hurts right now.",
      choices: []
    });
    
    nodes.set('bed_racing_mind', {
      id: 'bed_racing_mind',
      speaker: 'Inner Voice',
      text: "Thoughts loop: worry, fear, regret, catastrophizing. Sleep requires letting go of control, but anxiety never takes a break. How do I rest a restless mind?",
      choices: []
    });
    
    nodes.set('bed_darkness', {
      id: 'bed_darkness',
      speaker: 'Inner Voice',
      text: "In daylight, fears seem manageable. In darkness, they grow teeth and claws. Night strips away the pretense that everything is okay.",
      choices: []
    });
    
    nodes.set('bed_sanctuary', {
      id: 'bed_sanctuary',
      speaker: 'Inner Voice',
      text: "Everyone needs a place to retreat, to recharge, to feel completely safe. There's no shame in needing sanctuary, as long as it doesn't become permanent exile.",
      choices: []
    });
    
    nodes.set('bed_not_living', {
      id: 'bed_not_living',
      speaker: 'Inner Voice',
      text: "Existing isn't the same as living. Surviving isn't the same as thriving. This bed holds me like a grave holds the dead - safe, but not alive.",
      choices: []
    });
    
    return nodes;
  }
  
  /**
   * Chair dialogue tree - Sitting, waiting, and the paralysis of indecision
   */
  static getChairDialogue(): Map<string, DialogueNode> {
    const nodes = new Map<string, DialogueNode>();
    
    nodes.set('chair_start', {
      id: 'chair_start',
      speaker: 'Inner Voice',
      text: "This chair has become my throne and my stocks. I sit here for hours, paralyzed by indecision, overwhelmed by options, frozen by the fear of making the wrong choice.",
      choices: [
        { text: "I sit here because I don't know where else to go", nextId: 'chair_paralysis' },
        { text: "This chair has seen all my breakdowns", nextId: 'chair_witness' },
        { text: "Maybe I should just get up and move", nextId: 'chair_movement' }
      ]
    });
    
    nodes.set('chair_paralysis', {
      id: 'chair_paralysis',
      speaker: 'Inner Voice',
      text: "Every direction seems wrong. Stay here - stagnation. Go out - danger. Work - overwhelming. Rest - guilt. When every choice feels like a trap, not choosing becomes the choice.",
      choices: [
        { text: "Inaction is also a choice", nextId: 'chair_inaction' },
        { text: "I need to break this pattern", nextId: 'chair_pattern_break' }
      ]
    });
    
    nodes.set('chair_witness', {
      id: 'chair_witness',
      speaker: 'Inner Voice',
      text: "If this chair could talk, what stories would it tell? Panic attacks absorbed into its cushions, tears soaked into its fabric, the weight of a person slowly disappearing into anxiety.",
      choices: [
        { text: "It would understand my pain", nextId: 'chair_understanding' },
        { text: "It would want me to get better", nextId: 'chair_encouragement' }
      ]
    });
    
    nodes.set('chair_movement', {
      id: 'chair_movement',
      speaker: 'Inner Voice',
      text: "Movement is medicine they say. But what they don't say is how heavy anxiety makes your body feel, how even standing up can feel like lifting the world.",
      choices: [
        { text: "Small movements count too", nextId: 'chair_small_steps' },
        { text: "I'm too tired to move", nextId: 'chair_exhaustion' }
      ]
    });
    
    nodes.set('chair_inaction', {
      id: 'chair_inaction',
      speaker: 'Inner Voice',
      text: "By not choosing, I'm choosing anxiety. By not acting, I'm acting on fear's behalf. This awareness doesn't make it easier, but it makes it clearer.",
      choices: []
    });
    
    nodes.set('chair_pattern_break', {
      id: 'chair_pattern_break',
      speaker: 'Inner Voice',
      text: "The first step to breaking any pattern is recognizing it. The second step is believing change is possible. The third step is moving - literally and figuratively.",
      choices: []
    });
    
    nodes.set('chair_understanding', {
      id: 'chair_understanding',
      speaker: 'Inner Voice',
      text: "This chair holds my pain without judgment, supports my weight without complaint. Sometimes we need witnesses to our struggle, even silent ones.",
      choices: []
    });
    
    nodes.set('chair_encouragement', {
      id: 'chair_encouragement',
      speaker: 'Inner Voice',
      text: "If chairs could have wishes, mine would want me to rise. Not just physically, but emotionally, mentally, spiritually. It's held me down so I could eventually stand up.",
      choices: []
    });
    
    nodes.set('chair_small_steps', {
      id: 'chair_small_steps',
      speaker: 'Inner Voice',
      text: "Shifting position, stretching an arm, taking a deep breath - these micro-movements matter. Recovery happens in increments smaller than anyone expects.",
      choices: []
    });
    
    nodes.set('chair_exhaustion', {
      id: 'chair_exhaustion',
      speaker: 'Inner Voice',
      text: "Anxiety is exhausting. Fighting your own mind all day, every day, is the most tiring job in the world. Rest here is earned, not lazy.",
      choices: []
    });
    
    return nodes;
  }

  /**
   * Get all dialogue trees organized by object ID
   */
  static getAllDialogue(): Map<string, Map<string, DialogueNode>> {
    const allDialogue = new Map<string, Map<string, DialogueNode>>();
    
    allDialogue.set('phone', this.getPhoneDialogue());
    allDialogue.set('laptop', this.getLaptopDialogue());
    allDialogue.set('vr_headset', this.getVRHeadsetDialogue());
    allDialogue.set('alarm_clock', this.getAlarmClockDialogue());
    allDialogue.set('desk', this.getDeskDialogue());
    allDialogue.set('bed', this.getBedDialogue());
    allDialogue.set('chair', this.getChairDialogue());
    
    return allDialogue;
  }
}