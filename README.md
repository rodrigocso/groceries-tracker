<h1 align="center">
  Groceries Tracker
</h1>

<p align="center">
    <a alt="Angular">
        <img src="https://img.shields.io/badge/Angular-v11-DD0031" />
    </a>
    <a alt="License">
        <img src="https://img.shields.io/badge/license-MIT-63B0CD.svg" />
    </a>
</p>

## Description ##

This application is the frontend part for [Groceries API](https://github.com/rodrigocso/springboot-groceries-api). As of right now, it only allows the user to register an **Item** (while also
creating a **Brand** and a **Product** if necessary) and adding **Purchases** for a visit (**Store** + Date).

## What was used

[Angular Material](https://material.angular.io/), [Angular Flex-Layout](https://github.com/angular/flex-layout), lazy loaded modules, a route resolver and custom form controls (ReactiveForms) - a datepicker wrapper and an autocomplete with server calls and selection capabilities.

## Unit testing

I only wrote test cases for the custom FormControls (implements `ControlValueAccessor`), since those seem to be the trickiest ones to test.

## License ##
This project is licensed under the terms of the MIT license.
