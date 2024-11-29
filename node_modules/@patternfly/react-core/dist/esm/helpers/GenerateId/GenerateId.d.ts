/** This Component can be used to wrap a functional component in order to generate a random ID
 * Example of how to use this component
 *
 * const Component = ({id}: {id: string}) => (
 *  <GenerateId>{randomId => (
 *     <div id={id || randomId}>
 *       div with random ID
 *     </div>
 *   )}
 *  </GenerateId>
 *  );
 */
import * as React from 'react';
interface GenerateIdProps {
    /** String to prefix the random id with */
    prefix?: string;
    /** Component to be rendered with the generated id */
    children(id: string): React.ReactNode;
}
declare class GenerateId extends React.Component<GenerateIdProps, {}> {
    static displayName: string;
    static defaultProps: {
        prefix: string;
    };
    id: string;
    render(): React.ReactNode;
}
export { GenerateId };
//# sourceMappingURL=GenerateId.d.ts.map