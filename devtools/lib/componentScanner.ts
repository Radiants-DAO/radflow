import type { DiscoveredComponent, PropDefinition } from '../types';

/**
 * Parse a component file and extract metadata
 * This runs on the server side via API route
 */
export function parseComponent(content: string, filePath: string): DiscoveredComponent | null {
  // Check for default export
  const hasDefaultExport = /export\s+default\s+function\s+(\w+)/.test(content) ||
                           /export\s+default\s+(\w+)/.test(content);
  
  if (!hasDefaultExport) return null;

  // Extract component name
  const nameMatch = content.match(/export\s+default\s+function\s+(\w+)/);
  const name = nameMatch?.[1] || 'Unknown';

  // Extract props interface
  const propsMatch = content.match(/interface\s+(\w+Props)\s*\{([^}]+)\}/);
  const props: PropDefinition[] = [];
  
  if (propsMatch) {
    const propsBody = propsMatch[2];
    const propLines = propsBody.split('\n').filter((l) => l.trim());
    
    for (const line of propLines) {
      const propMatch = line.match(/(\w+)(\?)?:\s*([^;]+)/);
      if (propMatch) {
        props.push({
          name: propMatch[1],
          type: propMatch[3].trim(),
          required: !propMatch[2],
        });
      }
    }
  }

  // Try inline type annotation if no interface found
  if (props.length === 0) {
    const inlineMatch = content.match(/\{\s*([^}]+)\s*\}\s*:\s*\{([^}]+)\}/);
    if (inlineMatch) {
      const propsBody = inlineMatch[2];
      const propLines = propsBody.split(/[,;]/).filter((l) => l.trim());
      
      for (const line of propLines) {
        const propMatch = line.trim().match(/(\w+)(\?)?:\s*(.+)/);
        if (propMatch) {
          props.push({
            name: propMatch[1],
            type: propMatch[3].trim(),
            required: !propMatch[2],
          });
        }
      }
    }
  }

  // Extract default values from destructuring
  const destructureMatch = content.match(/\{\s*([^}]+)\s*\}\s*:\s*(?:\w+Props|\{[^}]+\})/);
  if (destructureMatch) {
    const destructureBody = destructureMatch[1];
    for (const prop of props) {
      const defaultMatch = destructureBody.match(
        new RegExp(`${prop.name}\\s*=\\s*(['"\`]?[^,}]+['"\`]?)`)
      );
      if (defaultMatch) {
        prop.defaultValue = defaultMatch[1].trim();
      }
    }
  }

  return {
    name,
    path: filePath,
    props,
  };
}

