import * as React from 'react';
import Link from 'next/link';

export function IndexPage() {
  return (
    <main>
      <h1>Formik Examples and Fixtures</h1>
      <ul>
        <li>
          <Link href="/basic">
            <a>Basic</a>
          </Link>
        </li>
        <li>
          <Link href="/demos/field-array">
            <a>Field Array</a>
          </Link>
        </li>
        <li>
          <Link href="/async-submission">
            <a>Async Submission</a>
          </Link>
        </li>
        <li>
          <Link href="/components">
            <a>Components</a>
          </Link>
        </li>
        <li>
          <Link href="/format">
            <a>Parse + Format</a>
          </Link>
        </li>
        <li>
          <Link href="/perf500">
            <a>Performance Test: 500 Inputs</a>
          </Link>
        </li>
        <li>
          <Link href="/perf500-same">
            <a>Performance Test: 500 Inputs</a>
          </Link>
        </li>
        <li>
          <Link href="/sign-in">
            <a>Sign In Example</a>
          </Link>
        </li>
        <li>
          <Link href="/v3">
            <a>V3</a>
          </Link>
        </li>
      </ul>
    </main>
  );
}
