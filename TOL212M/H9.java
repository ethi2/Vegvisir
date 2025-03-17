// Author: Snorri Agnarsson, snorri@hi.is

// Mutable lists in Java.

public class H9
{
	// Instances of Link are mutable links with a
	// head that is an int and a tail that is a
	// finite chain of links. An empty chain is
	// denoted by null. It is possible to create
	// circular chains and it is possible to change
	// both the head and the tail.
	public static class Link
	{
		public int head;
		public Link tail;
	}
	
	// Usage:  H9.Link x = H9.cons(head,tail);
	// Pre:    head is an int, tail is an E9.Link (may be null).
	// Post:   x refers to a new H9.Link with the given head and
	//         tail.
	public static Link cons( int h, Link t )
	{
		Link newLink = new Link();
		newLink.head = h;
		newLink.tail = t;
		return newLink;
	}
	
	// Usage:  int n = H9.length(x);
	// Pre:    x is an H9.Link, may be null,
	//         and must not refer to a circular chain.
	// Eftir:  n is the number of links in the chain x.
	public static int length( H9.Link x )
	{
		//... use a loop to implement this body
		H9.Link tv = x;
		int telj = 0;
		//telj is how many links have been "walked" past
		while(tv != null)
		{
			tv = tv.tail;
			telj++;
		}
		return telj;
	}

	// Usage:  int i = H9.nth(x,n);
	// Pre:    n>=0, x is a chain with at least n+1 links.
	// Post:   i is the head of the n-th link in the chain
	//         where the 0-th link is the first link.
	public static int nth( H9.Link x, int n )
	{
		assert n>=0;
		assert x != null;
		//... use a loop to implement this body
		H9.Link tv = x;
		//0 <= k <= n
		//tv is the k-th link in chain x
		for(int k=0;k<n;k++)
		{
			tv = tv.tail;
			assert tv != null;
		}
		return tv.head;
	}
	
	// Usage:  H9.Link x = H9.makeChain(a);
	// Pre:    a refers to an int[]. Must not be null,
	//         but may be empty.
	// Post:   x is a chain that contains the values in a
	//         such that for i=0,...,a.length-1 we have
	//         H9.nth(x,i) == a[i].
	public static Link makeChain( int[] a )
	{
		assert a != null;
		//... use a loop to implement this body
		int ri = a.length-1;
		H9.Link bob = null;
		while(ri>=0)
		{
			bob = H9.cons(a[ri],bob);
			ri--;
		}
		return bob;
	}
	
	// Usage:  int i = H9.last(x);
	// Pre:    x refers to a H9.Link, must not be null,
	//         and must not refer to a circular chain.
	// Post:   i is the value in (the head of) the last
	//         link in x.
	public static int last( Link x )
	{
		assert x != null;
		//... use a loop to implement this body
		H9.Link tv = x;
		//move tv to last link in x
		while(tv.tail != null)
		{
			tv = tv.tail;
		}
		assert tv.tail == null;
		return tv.head;
	}

	// Usage:  H9.Link z = H9.destructiveRemoveLast(x);
	// Pre:    x refers to an H9.Link, must not be null
	//         and must not be circular.
	// Post:   z is a chain that contains the same links
	//         in the same order as x, except that the
	//         link that was last in x has been removed.
	//         The link in x that was in front of that
	//         last link (if any) now has a tail that is
	//         null.
	public static Link destructiveRemoveLast( Link x )
	{
		assert x != null;
		//... use a loop to implement this body
		int L = H9.length(x);
		if(L <= 1)
		{return null;}
		//L > 1
		H9.Link tv = x;
		/*
		The idea is to move the variable tv along the chain
		until it is the second-to-last link in it.
		Example 2-link chain:
		[ ]->[ ]->null
		 ^Startpoint and endpoint
		Thus, it should jump (n-2) times.
		Since n is at least 2 by now, this will be at least 0 jumps.
		*/
		int SP = L-2;
		assert SP >= 0;
		for(int n=0;n<SP;n++)
		{
			tv = tv.tail;
		}
		tv.tail = null;
		return x;
	}
	
	// Usage:  H9.Link r = H9.destructiveReverse(x);
	// Pre:    x is a chain, may be empty (i.e. null).
	// Post:   z is a chain containing the same links as
	//         x, but the order of the links has been
	//         reversed. The int values in the links are
	//         unchanged.
	public static Link destructiveReverse( Link x )
	{
		Link y = null;
		while( x != null )
			// y contains a chain of zero or more links that
			// have been removed from the front of x.
			// The order of the links in y are the reverse of
			// their order in x. The values in the links are
			// unchanged except for the tails.
			//... Program the body of this loop
		{
			Link temp = y;
			y = x;
			x = x.tail;
			y.tail = temp;
		}
		return y;
	}

	// Run the command
	//   java H9 1 2 3 4
	// and show what the program writes
	public static void main( String[] args )
	{
		H9.Link x = null;
		for( int i=0 ; i!=args.length ; i++ )
			x = H9.cons(Integer.parseInt(args[i]),x);
		while( x != null )
		{
			H9.Link z = H9.destructiveReverse(x);
			x = z;
			while( z != null )
			{
				System.out.print(z.head); System.out.print(" ");
				z = z.tail;
			}
			x = H9.destructiveRemoveLast(x);
			System.out.println();
		}
	}
}