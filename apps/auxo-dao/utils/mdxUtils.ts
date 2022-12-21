import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

interface source {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compiledSource: any;
  scope?: Record<string, unknown>;
  frontmatter?: Record<string, string>;
}

export const getProductData = (product: string | string[]) => {
  const fullPathDescription = path.join(
    'apps/auxo-dao/public/content/products',
    `${product}/description.mdx`,
  );
  const fullPathThesis = path.join(
    'apps/auxo-dao/public/content/products',
    `${product}/thesis.mdx`,
  );
  const fullPathInvestmentFocus = path.join(
    'apps/auxo-dao/public/content/products',
    `${product}/investmentFocus.mdx`,
  );

  const fullPathFallBack = path.join(
    'apps/auxo-dao/public/content/fallback.mdx',
  );

  let rawDescription: string;
  let rawThesis: string;
  let rawInvestmentFocus: string;

  try {
    rawDescription = fs.readFileSync(fullPathDescription, 'utf8');
  } catch (err) {
    rawDescription = fs.readFileSync(fullPathFallBack, 'utf8');
  }
  try {
    rawThesis = fs.readFileSync(fullPathThesis, 'utf8');
  } catch (err) {
    rawThesis = fs.readFileSync(fullPathFallBack, 'utf8');
  }
  try {
    rawInvestmentFocus = fs.readFileSync(fullPathInvestmentFocus, 'utf8');
  } catch (err) {
    rawInvestmentFocus = fs.readFileSync(fullPathFallBack, 'utf8');
  }

  const { content: descriptionContent } = matter(rawDescription);
  const { content: thesisContent } = matter(rawThesis);
  const { content: investmentFocusContent } = matter(rawInvestmentFocus);

  return {
    content: {
      descriptionContent,
      thesisContent,
      investmentFocusContent,
    },
  };
};

export const getVaultData = (vault: string | string[]) => {
  const fullPathAbout = path.join(
    'apps/auxo-dao/public/content/vaults',
    `${vault}.mdx`,
  );

  const fullPathFallBack = path.join(
    'apps/auxo-dao/public/content/fallback.mdx',
  );

  let rawAbout: string;

  try {
    rawAbout = fs.readFileSync(fullPathAbout, 'utf8');
  } catch (err) {
    rawAbout = fs.readFileSync(fullPathFallBack, 'utf8');
  }

  const { content: aboutContent } = matter(rawAbout);

  return {
    content: {
      aboutContent,
    },
  };
};

export const getProduct = async (product: string | string[]) => {
  const { content } = getProductData(product);
  const { content: fallbackContent } = getProductData('fallback');
  let sourceDescription: source;
  let sourceThesis: source;
  let sourceInvestmentFocus: source;
  try {
    sourceDescription = await serialize(content.descriptionContent, {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [[remarkGfm]],
      },
    });
  } catch (err) {
    console.error(err);
    sourceDescription = await serialize(fallbackContent.descriptionContent);
  }
  try {
    sourceThesis = await serialize(content.thesisContent, {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [[remarkGfm]],
      },
    });
  } catch (err) {
    console.error(err);
    sourceThesis = await serialize(fallbackContent.thesisContent);
  }

  try {
    sourceInvestmentFocus = await serialize(content.investmentFocusContent, {
      mdxOptions: {
        remarkPlugins: [[remarkGfm]],
      },
    });
  } catch (err) {
    console.error(err);
    sourceInvestmentFocus = await serialize(
      fallbackContent.investmentFocusContent,
    );
  }

  const { compiledSource: compiledSourceDescription } = sourceDescription;
  const { compiledSource: compiledSourceThesis } = sourceThesis;
  const { compiledSource: compiledSourceInvestmentFocus } =
    sourceInvestmentFocus;

  return {
    source: {
      compiledSourceDescription,
      compiledSourceThesis,
      compiledSourceInvestmentFocus,
    },
  };
};

export const getVault = async (vault: string | string[]) => {
  const { content } = getVaultData(vault);
  const { content: fallbackContent } = getVaultData('fallback');
  let sourceAbout: source;

  try {
    sourceAbout = await serialize(content.aboutContent, {
      mdxOptions: {
        remarkPlugins: [[remarkGfm]],
      },
    });
  } catch (err) {
    console.error(err);
    sourceAbout = await serialize(fallbackContent.aboutContent);
  }

  const { compiledSource: compiledSourceAbout } = sourceAbout;

  return {
    source: {
      compiledSourceAbout,
    },
  };
};
