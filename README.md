CLI for SNAP dataset, which is a collection of more than 50 large networks.<br>
🐚 [Shell](https://www.npmjs.com/package/snap-data.sh),
📜 [Files](https://unpkg.com/snap-data.sh/),
📘 [Wiki](https://github.com/nodef/snap-data.sh/wiki/).

This is for quickly fetching [SNAP datasets] that you need right from the CLI.
Currently there is only one command **clone**, where you can provide filters
for specifying exactly which datasets you need, and where to download them. If
a dataset already exists, it is skipped. This summary is shown at the end.
You can install this with `npm install -g snap-data.sh`.

> Stability: [Experimental](https://www.youtube.com/watch?v=L1j93RnIxEo).

<br>

```bash
## Clone soc-LiveJournal1
## : save in current directory
$ snap-data clone --id soc-LiveJournal1


## Clone all temporal datasets
## : save in "/home/user/temporal-networks" directory
$ snap-data clone --type temporal "/home/user/temporal-networks"


## Clone all temporal & directed datasets
## : save in current directory
$ snap-data clone --type "temporal,directed"
```

<br>
<br>


## Index

| Command         | Action                       |
| --------------- | ---------------------------- |
| [clone] | Download SNAP dataset(s). |

<br>
<br>


## References

- [Stanford Large Network Dataset Collection][SNAP datasets]

<br>
<br>

[![](https://i.imgur.com/bJsIAeL.jpg)](https://www.youtube.com/watch?v=3479tkagiNo)

[SNAP datasets]: http://snap.stanford.edu/data/index.html
[clone]: https://github.com/nodef/snap-data.sh/wiki/clone
