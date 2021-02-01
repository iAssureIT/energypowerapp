import {useContext} from 'react';
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationContext,
} from 'react-navigation';
export function useNavigation() {
  return useContext(NavigationContext);
}
