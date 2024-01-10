# test-support-library (TSLib)
An ultra-lightweight JavaScript module test library
Based on pure HTML, CSS and JavaScript. Can test JavaScript modules and non-modules. No installation. No configuration. Supports test document trees.

## HTML Documentation

<p><a href="https://bassmationcode.github.io/test-support-lib/test-support-library.htm">Documentation</a></p>

## Overview
A module test is defined an an ordinary HTML file, opened in the browser of your choice. The document contains test script elements, written in very simple JavaScript.

A parent test document can import child test documents into HTML IFRAMEs, so a large test job can be organized into a nice test document tree. Test results are reported from child to parent documents.

Combined and document summaries provide condensed status information. Color codes guide the developer quickly to failed tests, even in very complex test document structures. A child test document can also be opend as root document without change. This allows quick testing of partial document trees and even single test documents.

Here is a screenshot of a test suite of two nested test documents.

<img src="https://github.com/bassmationcode/js-test/blob/main/docs/img/fig-001.png?raw=true" alt="First impression" style="width:500px"/>

## Usage
Copy the CSS and JS files into your "/include/test-support-lib/" folder, then include them in your test HTML files appropriately.

