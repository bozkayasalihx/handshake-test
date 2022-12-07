package main

import (
	"fmt"
	"os/exec"
	"strings"
)

func main() {

	fmt.Println("finding root dir")
	out, err := exec.Command("git", "rev-parse", "--show-toplevel").Output()
	if err != nil {
		panic(err.Error())
	}
	serverDir := strings.TrimSpace(string(out)) + "/apps/server/dist"
	_, err1 := exec.Command("rm", "-rf", serverDir).Output()
	if err1 != err1 {
		panic(err1.Error())
	}

	fmt.Println("all done..")

}
