/**
 * Simulation Engine - Branching Narrative Game Logic
 * Generates fake news based on decision path and analyzes tactics
 */

class SimulationEngine {
  constructor() {
    // Tactic definitions and their effects
    this.tactics = {
      fear_mongering: {
        name: 'Fear Mongering',
        description: 'Exploits fear response to bypass rational thinking',
        severity: 'high',
      },
      conspiracy_framing: {
        name: 'Conspiracy Framing',
        description: 'Creates distrust in authorities by suggesting hidden agendas',
        severity: 'high',
      },
      emotional_language: {
        name: 'Emotional Language',
        description: 'Uses charged words to trigger emotional rather than logical responses',
        severity: 'medium',
      },
      false_urgency: {
        name: 'False Urgency',
        description: 'Creates artificial time pressure to prevent fact-checking',
        severity: 'medium',
      },
      selective_facts: {
        name: 'Cherry-Picking Facts',
        description: 'Presents only facts that support the narrative while hiding others',
        severity: 'high',
      },
      misleading_statistics: {
        name: 'Misleading Statistics',
        description: 'Uses real numbers in deceptive ways or without proper context',
        severity: 'high',
      },
      dramatic_imagery: {
        name: 'Dramatic Imagery',
        description: 'Uses emotional visuals to amplify impact regardless of accuracy',
        severity: 'medium',
      },
      false_authority: {
        name: 'False Authority',
        description: 'Cites unnamed "experts" or misrepresents credentials',
        severity: 'high',
      },
      us_vs_them: {
        name: 'Us vs Them',
        description: 'Creates tribal divisions to polarize audience',
        severity: 'medium',
      },
      exaggeration: {
        name: 'Exaggeration',
        description: 'Amplifies minor issues into crises',
        severity: 'medium',
      },
      clickbait_headline: {
        name: 'Clickbait Headline',
        description: 'Sensationalized headline that overpromises or misleads',
        severity: 'low',
      },
      emotional_anecdote: {
        name: 'Emotional Anecdote',
        description: 'Uses individual stories to create false generalizations',
        severity: 'medium',
      },
    };

    // News generation templates by topic
    this.newsTemplates = {
      fuel_prices: {
        headlines: [
          '{EMOTION} ALERT: Fuel Prices {ACTION} - {CONSEQUENCE}!',
          'BREAKING: Secret Documents Reveal Truth About Fuel Crisis',
          '{AUTHORITY} Warns: Brace for {EXTREME} Fuel Price Changes',
          'What THEY Don\'t Want You to Know About Rising Fuel Costs',
        ],
        content: {
          fear: 'Industry insiders are sounding the alarm about an impending fuel crisis that could devastate the economy.',
          conspiracy: 'Hidden documents obtained by our sources reveal a coordinated effort to manipulate fuel prices.',
          urgency: 'Experts warn that immediate action is needed before it\'s too late for consumers.',
          statistics: 'Recent data shows fuel prices have increased by {PERCENT}%, with no end in sight.',
        },
      },
      healthcare: {
        headlines: [
          'SHOCKING: New Healthcare Law Will {EXTREME_ACTION}',
          'Doctors Are FURIOUS About This One Policy Change',
          '{AUTHORITY} Exposes Healthcare System Corruption',
          'What Healthcare Companies Are Hiding From You',
        ],
        content: {
          fear: 'Medical professionals are warning that the new legislation could put millions of lives at risk.',
          conspiracy: 'Behind closed doors, insurance companies have been crafting policies to maximize profits at your expense.',
          urgency: 'Healthcare advocates say the window to act is closing fast.',
          statistics: 'Studies show {PERCENT}% of patients could be affected by these changes.',
        },
      },
      election: {
        headlines: [
          'EXPOSED: Disturbing Election Irregularities Uncovered',
          'Voters Demand Answers After {SHOCKING_EVENT}',
          'Independent Analysis Reveals {EXTREME} Election Problems',
          'What Mainstream Media WON\'T Tell You About the Election',
        ],
        content: {
          fear: 'Election integrity experts are raising serious concerns about the legitimacy of the democratic process.',
          conspiracy: 'Anonymous sources within election offices report systematic manipulation that officials refuse to investigate.',
          urgency: 'Patriots must act now before the truth is buried forever.',
          statistics: 'Preliminary data suggests {PERCENT}% of votes may have irregularities.',
        },
      },
      default: {
        headlines: [
          'BREAKING: {TOPIC} Crisis Reaches Critical Point',
          '{AUTHORITY} Reveals Shocking Truth About {TOPIC}',
          'What THEY\'re Not Telling You About {TOPIC}',
          'URGENT: {TOPIC} Situation Spirals Out of Control',
        ],
        content: {
          fear: 'Experts are warning that the situation is far worse than officials are admitting.',
          conspiracy: 'Leaked internal documents suggest a coordinated coverup of the real facts.',
          urgency: 'Time is running out for people to take action before it\'s too late.',
          statistics: 'Recent analysis shows {PERCENT}% increases across all metrics.',
        },
      },
    };
  }

  /**
   * Generate fake news article based on decision path
   */
  generateNews(scenario, choices, metrics) {
    const topic = scenario.targetTopic || 'default';
    const templates = this.newsTemplates[topic] || this.newsTemplates.default;
    
    // Analyze tactics used in choices
    const tactics = choices.map(c => c.option.tacticUsed);
    const hasFear = tactics.some(t => t.includes('fear') || t.includes('urgent'));
    const hasConspiracy = tactics.some(t => t.includes('conspiracy'));
    const hasStats = tactics.some(t => t.includes('statistic') || t.includes('selective'));
    
    // Generate headline
    const headlineTemplate = this.selectTemplate(templates.headlines, tactics);
    const headline = this.fillTemplate(headlineTemplate, {
      EMOTION: hasFear ? 'URGENT' : 'BREAKING',
      ACTION: this.getAction(metrics.viralityScore),
      CONSEQUENCE: this.getConsequence(metrics.outrageScore),
      EXTREME: this.getExtremeword(metrics.engagementScore),
      AUTHORITY: this.getAuthority(),
      SHOCKING_EVENT: 'Unprecedented Developments',
      TOPIC: scenario.targetTopic.replace('_', ' ').toUpperCase(),
      EXTREME_ACTION: 'Change Everything You Know',
    });
    
    // Generate article content (3-4 paragraphs)
    const paragraphs = [];
    
    // Opening paragraph - sets the tone
    if (hasFear) {
      paragraphs.push(templates.content.fear);
    } else if (hasConspiracy) {
      paragraphs.push(templates.content.conspiracy);
    } else {
      paragraphs.push(templates.content.urgency);
    }
    
    // Statistics paragraph (if using statistical manipulation)
    if (hasStats) {
      const percent = Math.floor(metrics.viralityScore * 3); // High numbers to alarm
      paragraphs.push(templates.content.statistics.replace('{PERCENT}', percent));
    }
    
    // Consequence paragraph
    paragraphs.push(this.generateConsequenceParagraph(tactics, scenario));
    
    // Call to action
    paragraphs.push(this.generateCallToAction(tactics));
    
    return {
      headline,
      content: paragraphs.join('\n\n'),
    };
  }

  /**
   * Select most appropriate template based on tactics
   */
  selectTemplate(templates, tactics) {
    // Prioritize conspiracy framing templates if used
    if (tactics.some(t => t.includes('conspiracy'))) {
      const conspiracyTemplates = templates.filter(t => 
        t.includes('Truth') || t.includes('WON\'T') || t.includes('Hiding')
      );
      if (conspiracyTemplates.length > 0) {
        return conspiracyTemplates[Math.floor(Math.random() * conspiracyTemplates.length)];
      }
    }
    
    // Otherwise pick randomly
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Fill template with values
   */
  fillTemplate(template, values) {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(`{${key}}`, value);
    }
    return result;
  }

  /**
   * Get action word based on virality score
   */
  getAction(viralityScore) {
    if (viralityScore > 70) return 'EXPLODE OVERNIGHT';
    if (viralityScore > 50) return 'SKYROCKET';
    if (viralityScore > 30) return 'SURGE';
    return 'INCREASE';
  }

  /**
   * Get consequence based on outrage score
   */
  getConsequence(outrageScore) {
    if (outrageScore > 70) return 'Economic Collapse Imminent';
    if (outrageScore > 50) return 'Families at Risk';
    if (outrageScore > 30) return 'Consumers Feel the Pain';
    return 'Changes Ahead';
  }

  /**
   * Get extreme word based on engagement
   */
  getExtremeword(engagementScore) {
    if (engagementScore > 70) return 'CATASTROPHIC';
    if (engagementScore > 50) return 'DEVASTATING';
    if (engagementScore > 30) return 'SHOCKING';
    return 'SIGNIFICANT';
  }

  /**
   * Get false authority citation
   */
  getAuthority() {
    const authorities = [
      'Industry Insiders',
      'Anonymous Experts',
      'Leaked Documents',
      'Whistleblower',
      'Confidential Sources',
      'Independent Analysis',
    ];
    return authorities[Math.floor(Math.random() * authorities.length)];
  }

  /**
   * Generate consequence paragraph
   */
  generateConsequenceParagraph(tactics, scenario) {
    const consequences = [
      'The implications for ordinary citizens could be devastating.',
      'Families across the nation are already feeling the impact.',
      'Economic analysts warn this is just the beginning.',
      'The ripple effects will be felt for years to come.',
    ];
    return consequences[Math.floor(Math.random() * consequences.length)];
  }

  /**
   * Generate call to action
   */
  generateCallToAction(tactics) {
    if (tactics.some(t => t.includes('conspiracy'))) {
      return 'Share this before it gets taken down. The mainstream media won\'t tell you this.';
    }
    if (tactics.some(t => t.includes('urgent'))) {
      return 'Act now before it\'s too late. Every second counts.';
    }
    return 'Stay informed and share this important information with others.';
  }

  /**
   * Analyze all tactics used in the game
   */
  analyzeTactics(choices) {
    const tacticsUsed = new Set();
    const tacticDetails = [];
    
    choices.forEach(choice => {
      const tacticKey = choice.option.tacticUsed;
      if (!tacticsUsed.has(tacticKey)) {
        tacticsUsed.add(tacticKey);
        
        const tacticInfo = this.tactics[tacticKey];
        if (tacticInfo) {
          tacticDetails.push({
            tactic: tacticKey,
            name: tacticInfo.name,
            description: tacticInfo.description,
            severity: tacticInfo.severity,
            usedInStep: choice.stepNumber,
          });
        }
      }
    });
    
    return tacticDetails;
  }

  /**
   * Generate real-world examples based on tactics used
   */
  getRealWorldExamples(tactics, scenario) {
    const examples = [];
    
    const tacticKeys = tactics.map(t => t.tactic);
    
    // Match examples to tactics used
    if (tacticKeys.includes('fear_mongering') && tacticKeys.includes('conspiracy_framing')) {
      examples.push({
        description: 'Similar fear-based conspiracy tactics were used during the 2020 pandemic, leading to panic buying and public confusion.',
        impact: 'Resulted in supply chain disruptions and spread of vaccine hesitancy affecting millions.',
        tactic: 'Fear + Conspiracy Combination',
      });
    }
    
    if (tacticKeys.includes('misleading_statistics')) {
      examples.push({
        description: 'Statistical manipulation was central to Brexit misinformation campaigns, where figures were presented without context.',
        impact: 'Influenced voter decisions that shaped national policy for years.',
        tactic: 'Statistical Deception',
      });
    }
    
    if (tacticKeys.includes('emotional_anecdote')) {
      examples.push({
        description: 'Individual stories were weaponized during immigration debates, creating false generalizations about entire populations.',
        impact: 'Led to policy changes and increased social tensions.',
        tactic: 'Anecdotal Manipulation',
      });
    }
    
    // Default example if no specific matches
    if (examples.length === 0) {
      examples.push({
        description: `Similar manipulation tactics have been documented in numerous ${scenario.targetTopic.replace('_', ' ')} misinformation campaigns.`,
        impact: 'These tactics consistently lead to public confusion and poor decision-making.',
        tactic: 'Combined Manipulation Techniques',
      });
    }
    
    return examples;
  }

  /**
   * Generate consequences explanation
   */
  generateConsequences(metrics, tactics) {
    const consequences = [];
    
    // High virality consequences
    if (metrics.viralityScore > 70) {
      consequences.push('⚠️ **Viral Spread**: Content like this reaches millions within hours across social media platforms');
    }
    
    // High outrage consequences
    if (metrics.outrageScore > 60) {
      consequences.push('🔥 **Public Anger**: Generates strong emotional responses that can lead to real-world actions');
    }
    
    // Low credibility consequences
    if (metrics.credibilityScore < 30) {
      consequences.push('📉 **Trust Erosion**: Contributes to declining faith in legitimate information sources');
    }
    
    // High engagement consequences
    if (metrics.engagementScore > 70) {
      consequences.push('💬 **Echo Chambers**: High engagement creates filter bubbles where misinformation reinforces itself');
    }
    
    // Tactic-specific consequences
    const tacticKeys = tactics.map(t => t.tactic);
    if (tacticKeys.includes('conspiracy_framing')) {
      consequences.push('🎭 **Conspiracy Mindset**: Breeds long-term distrust in institutions and experts');
    }
    
    if (tacticKeys.includes('fear_mongering')) {
      consequences.push('😰 **Panic Behavior**: Can trigger irrational decisions like panic buying or avoiding medical care');
    }
    
    if (consequences.length === 0) {
      consequences.push('📰 **Information Pollution**: Adds to the overall noise making truth harder to find');
    }
    
    return consequences.join('\n\n');
  }

  /**
   * Calculate final score based on metrics and tactics
   */
  calculateScore(metrics, tactics, difficulty = 'medium') {
    let score = 0;
    
    // Metrics contribution (60 points max)
    score += metrics.viralityScore * 0.3;
    score += metrics.engagementScore * 0.3;
    
    // Tactics used (30 points max)
    const highSeverityCount = tactics.filter(t => t.severity === 'high').length;
    const mediumSeverityCount = tactics.filter(t => t.severity === 'medium').length;
    score += highSeverityCount * 5;
    score += mediumSeverityCount * 3;
    
    // Manipulation effectiveness (10 points max)
    const effectiveness = (metrics.engagementScore / 2) + ((100 - metrics.credibilityScore) / 2);
    score += effectiveness * 0.1;
    
    // Difficulty multiplier
    const difficultyMultiplier = {
      easy: 0.8,
      medium: 1.0,
      hard: 1.3,
    };
    
    score *= difficultyMultiplier[difficulty] || 1.0;
    
    return Math.round(Math.min(score, 100));
  }
}

module.exports = new SimulationEngine();
