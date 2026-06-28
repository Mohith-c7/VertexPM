import { OperatorRegistry } from './operator.registry.js';
import * as handlers from './handlers.js';

OperatorRegistry.register('equals', handlers.EqualsHandler);
OperatorRegistry.register('not_equals', handlers.NotEqualsHandler);
OperatorRegistry.register('contains', handlers.ContainsHandler);
OperatorRegistry.register('not_contains', handlers.NotContainsHandler);
OperatorRegistry.register('starts_with', handlers.StartsWithHandler);
OperatorRegistry.register('ends_with', handlers.EndsWithHandler);
OperatorRegistry.register('greater_than', handlers.GreaterThanHandler);
OperatorRegistry.register('less_than', handlers.LessThanHandler);
OperatorRegistry.register('greater_than_or_equals', handlers.GreaterThanOrEqualsHandler);
OperatorRegistry.register('less_than_or_equals', handlers.LessThanOrEqualsHandler);
OperatorRegistry.register('in', handlers.InHandler);
OperatorRegistry.register('not_in', handlers.NotInHandler);
OperatorRegistry.register('is_null', handlers.IsNullHandler);
OperatorRegistry.register('is_not_null', handlers.IsNotNullHandler);
OperatorRegistry.register('between', handlers.BetweenHandler);
OperatorRegistry.register('not_between', handlers.NotBetweenHandler);

export { OperatorRegistry };
