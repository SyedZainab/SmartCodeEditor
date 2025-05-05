import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box ml={2} mb={4}>
      <Text mb={2} mr={2} fontSize="lg" as="label" htmlFor="language-selector">
        Language:
      </Text>
      <Menu isLazy>
        <MenuButton
          as={Button}
          id="language-selector"
          aria-label={`Select programming language, current: ${language}`}
        >
          {language}
        </MenuButton>
        <MenuList bg="#110c1b">
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : ""}
              bg={lang === language ? "gray.900" : "transparent"}
              _hover={{
                color: ACTIVE_COLOR,
                bg: "gray.900",
              }}
              onClick={() => onSelect(lang)}
              aria-label={`Select ${lang} version ${version}`}
            >
              {lang}
               
              <Text as="span" color="gray.600" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;