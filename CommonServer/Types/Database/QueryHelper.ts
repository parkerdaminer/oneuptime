import ObjectID from 'Common/Types/ObjectID';
import { FindOperator, Raw } from 'typeorm';
import Text from 'Common/Types/Text';
import Typeof from 'Common/Types/Typeof';

export default class QueryHelper {
    public static findWithSameText(text: string | number): FindOperator<any> {
        let isString: boolean = false;

        if (typeof text === Typeof.String) {
            text = (text as string).toLowerCase().trim();
            isString = true;
        }
        const rid: string = Text.generateRandomText(10);
        return Raw(
            (alias: string) => {
                return isString
                    ? `LOWER(${alias}) = :${rid}`
                    : `${alias} = :${rid}`;
            },
            {
                [rid]: `${text}`,
            }
        );
    }

    public static search(name: string): FindOperator<any> {
        name = name.toLowerCase().trim();
        const rid: string = Text.generateRandomText(10);
        return Raw(
            (alias: string) => {
                return `LOWER(${alias}) LIKE (:${rid})`;
            },
            {
                [rid]: `%${name}%`,
            }
        );
    }

    public static in(values: Array<string | ObjectID>): FindOperator<any> {
        values = values.map((value: string | ObjectID) => {
            return value.toString();
        });
        const rid: string = Text.generateRandomText(10);
        return Raw(
            (alias: string) => {
                return `${alias} IN (:...${rid})`;
            },
            {
                [rid]: values,
            }
        );
    }

    public static equalTo(value: string): FindOperator<any> {
        const rid: string = Text.generateRandomText(10);
        return Raw(
            (alias: string) => {
                return `${alias} = :${rid}`;
            },
            {
                [rid]: value.toString(),
            }
        );
    }
}
