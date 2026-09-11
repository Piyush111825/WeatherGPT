import { PlanEvaluationResult, WeatherTelemetry } from '../types';

export function speakText(text: string, lang = 'en-US') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  try {
    window.speechSynthesis.cancel(); // Stop any prior speech
    const cleanText = text
      .replace(/[#*•_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (e) {
    console.error('Copy to clipboard failed', e);
    return false;
  }
}

export function evaluatePlan(query: string, telemetry: WeatherTelemetry): PlanEvaluationResult {
  const q = query.toLowerCase();

  if (q.includes('travel') || q.includes('6 pm') || q.includes('commute') || q.includes('drive') || q.includes('journey')) {
    return {
      query,
      riskLevel: 'YELLOW • Minor Caution',
      riskClass: 'yellow',
      impactDescription: 'Moderate road delay risk from slick asphalt, minor water accumulation, and reduced visibility.',
      whatToExpect: `${telemetry.coordinates} corridors will experience ${telemetry.temp}°C, ${telemetry.humidity}% humidity, with rain chance around ${telemetry.rainProb}%.`,
      aiRecommendation: 'Depart 15–20 minutes ahead of schedule. Maintain a 3-second braking distance on highway segments.',
      bestTimeWindow: 'Optimal travel window: Before 4:00 PM or post 8:00 PM',
    };
  }

  if (q.includes('cricket') || q.includes('play') || q.includes('sport') || q.includes('football') || q.includes('match')) {
    return {
      query,
      riskLevel: 'AMBER • High Interruption Risk',
      riskClass: 'yellow',
      impactDescription: 'Field saturation and high precipitation odds (~59-75%) will cause wet turf conditions and slippery ball handling.',
      whatToExpect: 'Convective cloud thickening during late afternoon with sudden brief showers and gusty surface wind shifts up to 18 km/h.',
      aiRecommendation: 'Consider reserving covered/indoor turf facility, or commence match early before 3:00 PM.',
      bestTimeWindow: 'Recommended play slot: 7:00 AM – 11:30 AM (Dry surface, comfortable heat index)',
    };
  }

  if (q.includes('wear') || q.includes('cloth') || q.includes('dress') || q.includes('jacket')) {
    return {
      query,
      riskLevel: 'GREEN • Safe With Rainwear',
      riskClass: 'green',
      impactDescription: 'High relative humidity (89%) and 30°C feels-like index make heavy fabrics uncomfortable.',
      whatToExpect: 'Intermittent humid warmth punctuated by cool breeze bursts when cloud showers pass overhead.',
      aiRecommendation: 'Opt for lightweight, breathable synthetic or cotton layers. Pair with waterproof outer shell or carry a travel umbrella.',
      bestTimeWindow: 'All-day guideline: Light clothing with rain protection ready in backpack',
    };
  }

  if (q.includes('walk') || q.includes('jog') || q.includes('run') || q.includes('stroll')) {
    return {
      query,
      riskLevel: 'GREEN • Favorable Early Window',
      riskClass: 'green',
      impactDescription: 'Clean air (AQI 67) is suitable for outdoor cardio, though afternoon mugginess increases perspiration.',
      whatToExpect: 'Gentle breeze at 9.8 km/h with pleasant cloud cover keeping direct sun irradiance low.',
      aiRecommendation: 'Hydrate well before starting. Finish walks before 2:00 PM to avoid catching late afternoon scattered rain.',
      bestTimeWindow: 'Best walking window: 6:00 AM – 9:30 AM or 7:30 PM – 9:00 PM',
    };
  }

  if (q.includes('car') || q.includes('wash')) {
    return {
      query,
      riskLevel: 'RED • Not Recommended Today',
      riskClass: 'red',
      impactDescription: 'High rain probability (59%) and subsequent road splash will immediately undo vehicle washing.',
      whatToExpect: 'Water spots from rain droplets mixing with ambient particulates.',
      aiRecommendation: 'Defer full exterior wash by 36-48 hours until frontal system passes and dry skies stabilize.',
      bestTimeWindow: 'Next optimal car washing slot: Friday morning onwards',
    };
  }

  if (q.includes('wedding') || q.includes('reception') || q.includes('party') || q.includes('outdoor event')) {
    return {
      query,
      riskLevel: 'AMBER • Weather Proofing Mandatory',
      riskClass: 'yellow',
      impactDescription: 'Outdoor lawns subject to moisture dampening; elevated likelihood of evening rainfall.',
      whatToExpect: 'High humidity, possible sudden shower spurts, and damp grass underfoot.',
      aiRecommendation: 'Deploy waterproof marquee tents with elevated wooden flooring. Arrange auxiliary indoor banquet hall backup.',
      bestTimeWindow: 'Prepare rain-sheltered banquet setups prior to 4:00 PM',
    };
  }

  // Default evaluation
  return {
    query,
    riskLevel: telemetry.rainProb > 50 ? 'YELLOW • Minor Caution' : 'GREEN • Safe Conditions',
    riskClass: telemetry.rainProb > 50 ? 'yellow' : 'green',
    impactDescription: `Analyzed against live ${telemetry.coordinates} telemetry: Temp ${telemetry.temp}°C, Humidity ${telemetry.humidity}%, Rain Chance ${telemetry.rainProb}%.`,
    whatToExpect: `Current condition is ${telemetry.condition} with steady atmospheric wind at ${telemetry.windSpeed} km/h (${telemetry.windDirection}).`,
    aiRecommendation: telemetry.rainProb > 50
      ? 'Keep a rain cover handy, check radar progression 30 minutes prior, and secure moisture-sensitive assets.'
      : 'Conditions are stable. Proceed with normal scheduling while monitoring standard diurnal temperature shifts.',
    bestTimeWindow: 'Safest activity window: Early morning through early afternoon',
  };
}
