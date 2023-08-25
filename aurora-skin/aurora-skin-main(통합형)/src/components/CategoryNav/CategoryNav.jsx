import { OffCanvas } from '@shopby/react-components';

import CategoryNavLinks from './CategoryNavLinks';
import Cs from './Cs';
import SignInButton from './SignInButton';

const CategoryNav = () => (
  <OffCanvas className="category-nav">
    <SignInButton />
    <CategoryNavLinks />
    <Cs />
  </OffCanvas>
);

export default CategoryNav;
