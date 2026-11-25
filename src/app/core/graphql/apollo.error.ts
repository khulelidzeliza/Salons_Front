import { onError } from '@apollo/client/link/error';
import { inject, Injectable } from '@angular/core';
import { SoonerService } from '../../shared/services/sooner.service';
import { ApolloLink } from '@apollo/client/core';
import { GraphQLFormattedError } from 'graphql';

@Injectable({
  providedIn: 'root',
})
export class ApolloError {
  private readonly sooner = inject(SoonerService);

  createErrorLink(): ApolloLink {
    return onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach((graphQLError) => {
          this.sooner.error(graphQLError.message, getErrorTitle(graphQLError.extensions));
        });
      } else if (networkError) {
        this.sooner.error(networkError.message, networkError.name);
      }
    });
  }
}

const getErrorTitle = (extensions: GraphQLFormattedError['extensions']): string => {
  return (extensions?.['code'] as string) ?? 'Error';
};