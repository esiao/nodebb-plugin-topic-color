NodeBB Topic Color
=========================

A NodeBB Plugin to add some colors to the topics titles.

Installation
=========================
As simple as that : 

    npm install nodebb-plugin-topic-color

Usage
=========================

1. After installation go to the ACP and enable the plugin.
2. Choose the groups that will be able to colorify their topics. Or create the `Bucket` group and put some users in it.
3. The magic happens with this simple instructions :

If you want some red you have the choice to use :
- Hexadecimal colors code like `#ff0000` or even `#f00`
- RGB values `rgb(255,0,0)`
- And finaly css color codes `red`

To use it it's pretty simple : 

    %(color)[Text]

Screenshots
=========================
Create your groups. Add the bucket one if you want to manage exactly who is able to colorify their topics or if the users are in a group system :

![Groups](http://i.imgur.com/tzfwTm0.png)

Choose the groups you want to be able to use the colorify topics title feature :

![Plugin settings](http://i.imgur.com/WXKmKRE.png)

This :

![Titles code](http://i.imgur.com/zwvzGkB.png)

Will become this (note that Test tried to fool the plugin but unlucky for him there's groups permissions) :

![Titles colorified](http://i.imgur.com/Ffo7k7V.png)

And if there's no group selected don't worry the titles will be as clean as before (this could be a way to disable the feature but you must keep the plugin activated) :

![No groups, no colors on topics titles](http://i.imgur.com/sIrhh5e.png)