import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloError } from '../graphql/apollo.error';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { env } from '../../../environments/environment';
import { AuthTokenService } from '../../shared/services/auth-token.service';

export const graphqlProvider = provideApollo(() => {
  const httpLink = inject(HttpLink);
  const errorLink = inject(ApolloError);
  const platformId = inject(PLATFORM_ID);
  const tokenService = inject(AuthTokenService);

  const http = httpLink.create({ uri: env.GRAPHQL_URL, withCredentials: true });

  const authLink = setContext(() => {
    if (!isPlatformBrowser(platformId)) return {};

    const token = tokenService.getTokens().access_token;
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  });

  const link = ApolloLink.from([authLink, errorLink.createErrorLink(), http]);

  return {
    cache: new InMemoryCache(),
    link,
  };
});