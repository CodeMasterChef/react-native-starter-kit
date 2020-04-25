class NumberHelper {
    textToNumber(text: string): number | null {
        try {
            return Number(text.replace(/\D/g, ''))
        } catch (err) {
            console.log(err);
            return null;
        }


    }
}

export const numberHelper = new NumberHelper();