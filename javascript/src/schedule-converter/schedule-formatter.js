// Messy formatter that mixes layout and business rules.
export class ScheduleFormatter {
  format(scheduleObject) {
    if (!scheduleObject || !Array.isArray(scheduleObject.sessions)) {
      return 'No sessions available.\n';
    }

    // Sort by start time if present, otherwise leave as-is
    const sorted = [...scheduleObject.sessions].sort((a, b) => {
      if (!a.start && !b.start) return 0;
      if (!a.start) return 1;
      if (!b.start) return -1;
      return String(a.start).localeCompare(String(b.start));
    });

    let output = '# Conference Schedule\n\n';

    for (const session of sorted) {
      const title = session.title || 'Untitled Session';
      const speaker = session.speaker || 'Unknown Speaker';
      const room = session.room || 'TBD room';
      const start = session.start || 'TBD time';

      output += `* ${start} – ${title} (${speaker}) in ${room}\n`;
    }

    return output;
  }
}

