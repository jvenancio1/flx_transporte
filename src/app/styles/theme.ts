import { extendTheme } from "@chakra-ui/react";

import colors from "./colors";
import FormLabel from "./components/FormLabel";
import Input from "./components/Input";
import Textarea from "./components/TextArea";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
  components: {
    FormLabel,
    Input,
    Textarea,
  },
  colors,

  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
};

const theme = extendTheme(config);

export default theme;
