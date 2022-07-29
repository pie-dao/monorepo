import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

export const getProductData = (product: string | string[]) => {
  const fullPathDescription = path.join(
    'apps/investify/public/content/products',
    `${product}/description.mdx`,
  );
  const fullPathThesis = path.join(
    'apps/investify/public/content/products',
    `${product}/thesis.mdx`,
  );
  const fullPathInvestmentFocus = path.join(
    'apps/investify/public/content/products',
    `${product}/investmentFocus.mdx`,
  );
  const rawDescription = fs.readFileSync(fullPathDescription, 'utf8');
  const rawThesis = fs.readFileSync(fullPathThesis, 'utf8');
  const rawInvestmentFocus = fs.readFileSync(fullPathInvestmentFocus, 'utf8');

  const { data: description, content: descriptionContent } =
    matter(rawDescription);
  const { data: thesis, content: thesisContent } = matter(rawThesis);
  const { data: investmentFocus, content: investmentFocusContent } =
    matter(rawInvestmentFocus);

  return {
    frontMatter: {
      data: {
        description,
        thesis,
        investmentFocus,
      },
      product,
    },
    content: {
      descriptionContent,
      thesisContent,
      investmentFocusContent,
    },
  };
};

export const getVaultData = (vault: string | string[]) => {
  const fullPathAbout = path.join(
    'apps/investify/public/content/vaults',
    `${vault}.mdx`,
  );

  const rawAbout = fs.readFileSync(fullPathAbout, 'utf8');

  const { data: about, content: aboutContent } = matter(rawAbout);

  return {
    frontMatter: {
      data: {
        about,
      },
      vault,
    },
    content: {
      aboutContent,
    },
  };
};

export const getProduct = async (product: string | string[]) => {
  const { frontMatter, content } = getProductData(product);

  const sourceDescription = await serialize(content.descriptionContent, {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [[remarkGfm]],
    },
  });

  const sourceThesis = await serialize(content.thesisContent, {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [[remarkGfm]],
    },
  });

  const sourceInvestmentFocus = await serialize(
    content.investmentFocusContent,
    {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [[remarkGfm]],
      },
    },
  );

  const { compiledSource: compiledSourceDescription } = sourceDescription;
  const { compiledSource: compiledSourceThesis } = sourceThesis;
  const { compiledSource: compiledSourceInvestmentFocus } =
    sourceInvestmentFocus;

  return {
    frontMatter,
    source: {
      compiledSourceDescription,
      compiledSourceThesis,
      compiledSourceInvestmentFocus,
    },
  };
};

export const getVault = async (vault: string | string[]) => {
  const { frontMatter, content } = getVaultData(vault);

  const sourceAbout = await serialize(content.aboutContent, {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [[remarkGfm]],
    },
  });

  const { compiledSource: compiledSourceAbout } = sourceAbout;

  return {
    frontMatter,
    source: {
      compiledSourceAbout,
    },
  };
};
