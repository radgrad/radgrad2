import * as React from 'react';
import { Dropdown, Header, Image, Menu, MenuProps, SemanticShorthandItem } from 'semantic-ui-react';

interface IMenuItem {
  label: string;
  regex: string;
  route: string;
}
