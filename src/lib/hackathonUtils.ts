/**
 * Shared utility functions for Hackathons date formatting and duration calculation.
 */

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats a YYYY-MM-DD date string into "DD MMM YYYY" format (e.g., "02 Aug 2026")
 * without any browser timezone offset shifts.
 */
export function formatHackathonDate(dateStr?: string): string {
    if (!dateStr) return '';
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return dateStr;
    const [_, year, month, day] = match;
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = MONTH_NAMES[monthIndex] || month;
    return `${day} ${monthName} ${year}`;
}

export interface DurationResult {
    duration: string;
    isValid: boolean;
    error?: string;
}

/**
 * Calculates the duration between a start and end date (and optional times).
 * - If both times are provided: calculates exact duration in hours (e.g. "36 Hours").
 * - If times are not provided: calculates inclusive calendar days (e.g. "1 Day", "5 Days").
 */
export function calculateHackathonDuration(
    startDate?: string,
    endDate?: string,
    startTime?: string,
    endTime?: string
): DurationResult {
    if (!startDate || !endDate) {
        return { duration: '', isValid: false };
    }

    if (endDate < startDate) {
        return { duration: '', isValid: false, error: 'End Date cannot be before Start Date' };
    }

    // Both start time and end time provided
    if (startTime && endTime) {
        const startDateTime = new Date(`${startDate}T${startTime}:00`);
        const endDateTime = new Date(`${endDate}T${endTime}:00`);
        const diffMs = endDateTime.getTime() - startDateTime.getTime();

        if (diffMs < 0) {
            return { duration: '', isValid: false, error: 'End Time cannot be before Start Time on the same date' };
        }

        const diffMinutes = Math.round(diffMs / (1000 * 60));
        if (diffMinutes <= 0) {
            return { duration: '0 Mins', isValid: true };
        }

        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;

        if (hours === 0) {
            return { duration: `${mins} ${mins === 1 ? 'Min' : 'Mins'}`, isValid: true };
        }

        if (mins === 0) {
            return { duration: `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`, isValid: true };
        }

        return { 
            duration: `${hours} ${hours === 1 ? 'Hour' : 'Hours'} ${mins} ${mins === 1 ? 'Min' : 'Mins'}`, 
            isValid: true 
        };
    }

    // Calendar day based calculation (inclusive)
    const startD = new Date(`${startDate}T00:00:00`);
    const endD = new Date(`${endDate}T00:00:00`);
    const diffDays = Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays <= 1) {
        return { duration: '1 Day', isValid: true };
    }
    return { duration: `${diffDays} Days`, isValid: true };
}

/**
 * Formats a hackathon item into the desired showcase display format:
 * "START DATE · CALCULATED DURATION" (e.g., "02 Aug 2026 · 36 Hours")
 * with backward compatibility for legacy records.
 */
export function getHackathonDateAndDurationDisplay(item: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    calculatedDuration?: string;
    date?: string;
}): string {
    if (!item) return '';

    if (item.startDate) {
        const formattedStart = formatHackathonDate(item.startDate);
        const { duration, isValid } = calculateHackathonDuration(
            item.startDate,
            item.endDate || item.startDate,
            item.startTime,
            item.endTime
        );
        const finalDuration = (isValid && duration) ? duration : (item.calculatedDuration || '');
        return finalDuration ? `${formattedStart} · ${finalDuration}` : formattedStart;
    }

    // Fallback for legacy records
    if (item.date) {
        return item.date.replace(/•/g, '·');
    }

    return '';
}
